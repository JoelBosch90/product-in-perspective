// Import dependencies
import { EventHandler } from "/javascript/tools/EventHandler.js";

/**
 *  The definition of the Router class that handles all routing in the app. This
 *  class is used to manage routes in a single page application manner. It
 *  listens for URL changes, processes the URL and triggers a 'navigate' event
 *  for the appropriate Component, and with the appropriate parameters from the
 *  URL.
 *
 *  Note that for each Component, all parameters are expected to be passed as a
 *  single object that will supplemented with the variables from the URL.
 *
 *
 *  @event      navigate      Triggered when the URL changes to a valid route.
 *                            Will provide an object that provides a Component
 *                            class and optionally Component parameters from the
 *                            URL.
 *  @event      not-found     Triggered when a route cannot be found.
 *  @event      not-allowed   Triggered when a user tries to access a page that
 *                            he is not authorized to visit.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Router extends EventHandler {

  /**
   *  This holds a reference to all currently installed routes.
   *  @var      {Map}
   */
  _routes = new Map();

  /**
   *  This is an array that contains strings that denote the start of protected
   *  routes.
   *  @var      {array}
   */
  _protected = [];

  /**
   *  Class constructor.
   *  @param    {Map}       routes      These routes that will be added
   *                                    immediately.
   *  @param    {object}    options
   *    @property {array}     protected   Optionally, all routes starting with
   *                                      one of these strings will required
   *                                      that the user is currently logged in.
   */
  constructor(routes = new Map(), options = {}) {

    // Initialize the Event Handler.
    super();

    // Store the initial routes.
    for (const route of routes.keys()) this.add(route, routes.get(route));

    // Store the protected routes.
    this._protected = options.protected;

    // Start listening for URL changes.
    window.addEventListener('popstate', this.navigateToCurrent);
  }

  /**
   *  Method to trigger the navigate event based on the current URL.
   *  @returns  {Router}
   */
  navigateToCurrent = () => {

    // Navigate to the path that is currently in the address bar.
    this.navigateTo(window.location.pathname);

    // Allow chaining.
    return this;
  }

  /**
   *  Method to check if the user is currently logged in. We can check this by
   *  checking the cookie that is set when logging in. This cookie does not
   *  contain the actual authorization token, but is simply a client-side
   *  indication to see if we should still be logged in.
   *  @returns  {boolean}
   */
  _loggedIn = () => {

    // Get all the cookies as an object.
    const cookies = document.cookie.split('; ').reduce((accumulator, current) => {

      // Split them by the equals operator.
      const [key, value] = current.split('=');

      // Assign the key value combination for each cookie to the object.
      accumulator[key] = value;

      // Return the object to keep checking.
      return accumulator;
    }, {});

    // We should have a cookie that says we're logged in.
    return cookies['activeSession'] == 'true';
  }

  /**
   *  Method to trigger the navigate event based on the provided URL.
   *  @param    {string}    path      The part of the URL after the domain.
   *  @returns  {Router}
   */
  navigateTo = path => {

    // We want to check if the user is currently logged in to see if we should
    // show protected routes. This is not really for security. The API will only
    // ever show data that the user is authorized to receive. Instead, this is
    // for user convenience to show whether he is properly authorized or not.
    const authorized = this._loggedIn();

    // If the user is not authorized, see if this path is protected.
    if (!authorized) for (const protectedPath of this._protected) {

      // If the path starts with a protected path, trigger a 'not-allowed'
      // event.
      if (path.startsWith(protectedPath)) return this.trigger("not-allowed");
    }

    // Loop through the routes to find a matching entry.
    for (const [route, entry] of this._routes.entries()) {

      // Try to match this path against the pattern for this route.
      const match = path.match(entry.pattern);

      // If there was no match, we should continue looking.
      if (!match) continue;

      // Initialize an object to hold the variables.
      const variables = {};

      // The match should contain the full match and the discovered variables.
      // Here, we only care about the variables, so we drop the first item from
      // the array.
      match.shift();

      // Loop through the indices of the variables.
      for (let i = 0; i < match.length; i++) {

        // Add each variable to the variables in the route entry.
        variables[entry.variables[i]] = match[i];
      }

      // Trigger the navigate event for this component and these variables.
      // Allow chaining.
      return this.trigger("navigate", {

        // Supply the component for this route entry. This should be the class
        // of the component.
        component:  entry.component,

        // Add the variables to the options object.
        options:    Object.assign({}, entry.options, variables),
      });
    }

    // Otherwise, we should trigger the not found error. Allow chaining.
    return this.trigger("not-found");
  }

  /**
   *  Method to add one single route to our internal map.
   *  @param    {string}    path      The part of the URL after the domain.
   *  @param    {Class}     Component The Component that should be started when
   *                                  the URL changes to match this path.
   *  @param    {object}    options   The default options that will be passed
   *                                  to the component.
   *                                  NB: variables in the path may overwrite
   *                                  these default options.
   *  @returns  {Router}
   */
  add = (path, Component, options) => {

    // While looping through the path, we want to keep track of the variable
    // names, in order.
    const variables = [];

    // We need to build a pattern that we can use to match incoming routes. We
    // only want matches if the entire string matches, so we indicate that this
    // is the start of the string.
    let pattern = '^';

    // Loop through all steps in the path, split by the forward slashes. Ignore
    // the first slash in the path.
    for (const step of path.substring(1).split('/')) {

      // Add a forward slash for each step in the pattern.
      pattern += '\/';

      // Is this step a placeholder for a variable?
      if (step.startsWith(':')) {

        // Store the variable name, make sure to strip the colon.
        variables.push(step.substring(1));

        // We need to match anything here until the next forward slash, but
        // there should at least be something.
        pattern += '([^\/]+)';

      // Otherwise, we just need to add this step to the pattern.
      } else pattern += step;
    }

    // Indicate that this should be the end of the string. Allow for an optional
    // trailing slash.
    pattern += '/?$';

    // We need to deconstruct the route and create mapping so that we can later
    // match paths to this route, and extract and name the variables in the
    // path.
    this._routes.set(path, {
      component:     Component,
      pattern,
      options,
      variables,
    });

    // Allow chaining.
    return this;
  }

  /**
   *  Method to remove one route.
   *  @param    {string}    path      The part of the URL after the domain.
   *  @returns  {Router}
   */
  delete = path => {

    // Delete this route from the Map object.
    this._routes.delete(path);

    // Allow chaining.
    return this;
  }

  /**
   *  Method to clear all routes.
   *  @returns  {Router}
   */
  clear = () => {

    // Clear the Map object that contains all routes.
    this._routes.clear();

    // Allow chaining.
    return this;
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Stop listening for URL changes.
    window.removeEventListener('popstate', this.navigateToCurrent);

    // Call the EventHandler's remove function.
    super.remove();
  }
}

// Export the Router class so it can be imported elsewhere.
export { Router };
