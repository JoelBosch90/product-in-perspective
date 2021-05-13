// Import dependencies
import { EventHandler } from "/javascript/tools/EventHandler.js";
import { goTo } from "/javascript/tools/goTo.js";
/**
 *  The definition of the Router class that handles all routing in the app. This
 *  class is used to manage routes in a single page application manner. It
 *  listens for URL changes, processes the URL and triggers a 'navigate' event
 *  for the appropriate Widget, and with the appropriate parameters from the
 *  URL.
 *
 *  @event      navigate      Triggered when the URL changes to a valid route.
 *                            Will provide an object that provides a Widget and
 *                            optionally Widget parameters from the URL.
 *  @event      not-found     Triggered when a route cannot be found.
 *
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
   *  Class constructor.
   *  @param    {Map}       routes    These routes that will be added
   *                                  immediately.
   */

  constructor(routes = new Map()) {
    // Initialize the Event Handler.
    super(); // Store the initial routes.

    for (const route of routes.keys()) this.add(route, routes.get(route)); // Start listening for URL changes.


    window.addEventListener('popstate', this.navigateToCurrent);
  }
  /**
   *  Method to trigger the navigate event based on the current URL.
   *  @returns  {Router}
   */


  navigateToCurrent = () => {
    // Navigate to the path that is currently in the address bar.
    this.navigateTo(window.location.pathname); // Allow chaining.

    return this;
  };
  /**
   *  Method to trigger the navigate event based on the provided URL.
   *  @returns  {Router}
   */

  navigateTo = path => {
    // Loop through the routes to find a matching one.
    for (const [route, params] of this._routes.entries()) {
      // Try to match this path against the route pattern.
      const match = path.match(params.pattern); // If there was no match, we should continue looking.

      if (!match) continue; // Return the matching route object.

      const routeObject = this._routes.get(route); // Initialize an object to hold the variables.


      const variables = {}; // The match should contain the full match and the discovered variables.
      // Here, we only care about the variables, so we drop the first item from
      // the array.

      match.shift(); // Loop through the indices of the variables.

      for (let i = 0; i < match.length; i++) {
        // Add each variable to the variables object.
        variables[routeObject.variables[i]] = match[i];
      } // Trigger the navigate event for this widget and these variables.


      this.trigger("navigate", {
        widget: routeObject.widget,
        options: variables
      }); // Allow chaining.

      return this;
    } // Otherwise, we should trigger the not found error.


    this.trigger("not-found"); // Allow chaining.

    return this;
  };
  /**
   *  Method to add one single route to our internal map.
   *  @param    {string}    path      The part of the URL after the domain.
   *  @param    {Class}     Widget    The Widget that should be started when the
   *                                  URL changes to match this path.
   *  @returns  {Router}
   */

  add = (path, Widget) => {
    // While looping through the path, we want to keep track of the variable
    // names, in order.
    const variables = []; // We need to build a pattern that we can use to match incoming routes. We
    // only want matches if the entire string matches, so we indicate that this
    // is the start of the string.

    let pattern = '^'; // Loop through all steps in the path, split by the forward slashes. Ignore
    // the first slash in the path.

    for (const step of path.substring(1).split('/')) {
      // Add a forward slash for each step in the pattern.
      pattern += '\/'; // Is this step a placeholder for a variable?

      if (step.startsWith(':')) {
        // Store the variable name, make sure to strip the colon.
        variables.push(step.substring(1)); // We need to match anything here until the next forward slash, but
        // there should at least be something.

        pattern += '([^\/]+)'; // Otherwise, we just need to add this step to the pattern.
      } else pattern += step;
    } // Indicate that this should be the end of the string. Allow for an optional
    // trailing slash.


    pattern += '/?$'; // We need to deconstruct the route and create mapping so that we can later
    // match paths to this route, and extract and name the variables in the
    // path.

    this._routes.set(path, {
      widget: Widget,
      pattern,
      variables
    }); // Allow chaining.


    return this;
  };
  /**
   *  Method to remove one route.
   *  @param    {string}    path      The part of the URL after the domain.
   *  @returns  {Router}
   */

  delete = path => {
    // Delete this route from the Map object.
    this._routes.delete(path); // Allow chaining.


    return this;
  };
  /**
   *  Method to clear all routes.
   *  @returns  {Router}
   */

  clear = () => {
    // Clear the Map object that contains all routes.
    this._routes.clear(); // Allow chaining.


    return this;
  };
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */

  remove() {
    // Stop listening for URL changes.
    window.removeEventListener('popstate', this.navigateToCurrent); // Call the EventHandler's remove function.

    super.remove();
  }

} // Export the Router class so it can be imported elsewhere.


export { Router };