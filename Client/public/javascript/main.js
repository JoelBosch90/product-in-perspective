(function () {
  'use strict';

  /**
   *  The definition of the EventHandler class that can trigger events. It
   *  features three different methods:
   *
   *    on        -   Is used to register an event listener. This method adds a
   *                  callback function to the _triggers variable for this event.
   *    off       -   Is used to remove an event listener. This method remove a
   *                  callback function from the _triggers variable for this
   *                  event.
   *    trigger   -   Is used to register an event. It can be provided with extra
   *                  data that is passed into the callback functions that are
   *                  registered in the _triggers variable for this event.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */
  class EventHandler {
    /**
     *  Private variable for event triggers.
     *  @var      object
     */
    _triggers = {};
    /**
     *  Private variable that keeps track of other EventHandler object that should
     *  trigger the same events.
     *  @var    {array}
     */

    _bubbleTo = [];
    /**
     *  Class constructor.
     */

    constructor() {}
    /**
     *  Method for triggering an event. This method will execute all callback
     *  functions that are registered in the _triggers variable and optionally
     *  pass the provided data to those functions.
     *  @param    {string}        event       Name of the event.
     *  @param    {object}        data        Data to be passed to the callbacks
     *                                        for this event.
     *  @returns  {EventHandler}
     */


    trigger = (event, data) => {
      // We only know how to handle string events.
      if (!typeof event == "string") return this; // Execute each registered callback function for this event.

      if (this._triggers[event]) this._triggers[event].forEach(listener => void listener(data)); // Trigger the same event on all other handlers we want to bubble to.

      if (this._bubbleTo) for (const handler of this._bubbleTo) handler.trigger(event, data); // Allow chaining;

      return this;
    };
    /**
     *  Method that propagates all events to a different EventHandler object.
     *  @param    {EventHandler}  EventObject
     *  @returns  {EventHandler}
     */

    bubbleTo = handler => {
      // We only know how to handle EventHandler objects.
      if (!handler instanceof EventHandler) return this; // Add this EventHandler to the bubbleTo list.

      this._bubbleTo.push(handler); // Allow chaining;


      return this;
    };
    /**
     *  Method that stops propagating all events to the specified EventHandler
     *  object.
     *  @param    {EventHandler}  EventObject
     *  @returns  {EventHandler}
     */

    bubbleOff = handler => {
      // We only know how to handle EventHandler objects.
      if (!handler instanceof EventHandler) return this; // Remove this EventHandler from the bubbleTo list.

      this._bubbleTo = this._bubbleTo.filter(bubbled => bubbled != handler); // Allow chaining;

      return this;
    };
    /**
     *  Method for storing event listeners per event. It will store the callbacks
     *  in separate arrays per event so that they can be triggered separately.
     *  @param    {string}        event       Name of the event.
     *  @param    {function}      listener    Function that should be called when
     *                                        the event happens.
     *  @returns  {EventHandler}
     */

    on = (event, listener) => {
      // We only know how to handle string events.
      if (!typeof event == "string") return this; // If no listeners exist for this event, create an array to house them.

      if (this._triggers[event] == undefined) this._triggers[event] = []; // Add this callback to the list for this event.

      this._triggers[event].push(listener); // Allow chaining;


      return this;
    };
    /**
     *  Method for removing event listeners per event. It will remove the callback
     *  from the array of callbacks that is currently stored for this event.
     *  @param    {string}        event       Name of the event.
     *  @param    {function}      listener    Function that should be called when
     *                                        the event happens.
     *  @returns  {EventHandler}
     */

    off = (event, listener) => {
      // We only know how to handle string events.
      if (!typeof event == "string") return this; // If there are no callbacks registered for this event, there is no need to
      // remove one.

      if (this._triggers[event] == undefined) return this; // If callbacks are registered for this event, make sure that this callback
      // is filtered from that array.

      this._triggers[event] = this._triggers[event].filter(item => item !== listener); // Allow chaining;

      return this;
    };
    /**
     *  Method to remove this object and clean up after itself.
     */

    remove() {
      // Delete the triggers object.
      this._triggers = {}; // Reset the bubbled array.

      this._bubbled = [];
    }

  } // Export the EventHandler class so it can be imported elsewhere.

  // Import dependencies
  /**
   *  The definition of the BaseElement class that can be used as a base for any
   *  class that is based on a DOM element.
   *
   *    show      -   Is used to show the main container.
   *    hide      -   Is used to hide the main container.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class BaseElement extends EventHandler {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  If we've ever set a page title, we want to remember that so that we can
     *  reinstall that title if we are showing again.
     */

    _pageTitle = null;
    /**
     *  Method to set the page title.
     *  @param    {string}    newTitle    The new title to install.
     *  @returns  {BaseElement}
     */

    pageTitle(newTitle) {
      // Remember this title.
      this._pageTitle = newTitle; // Install it as the page's title.

      document.getElementsByTagName("title")[0].textContent = newTitle; // Allow chaining.

      return this;
    }
    /**
     *  Method to show this element.
     *  @returns  {BaseElement}
     */


    show() {
      // Make sure we're not hiding.
      if (this._container) this._container.removeAttribute('hidden'); // If we have a page title, we want to install it again.

      if (this._pageTitle) this.pageTitle(this._pageTitle); // Allow chaining.

      return this;
    }
    /**
     *  Method to hide this element.
     *  @returns  {BaseElement}
     */


    hide() {
      // Make sure we're hiding.
      if (this._container) this._container.setAttribute('hidden', ''); // Allow chaining.

      return this;
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Remove the container if it was ever initialized.
      if (this._container) this._container.remove(); // Call the EventHandler's remove function.

      super.remove();
    }

  } // Export the BaseElement class so it can be imported elsewhere.

  /**
   *  Helper function to visit any page in the app without refreshing the page.
   *  @param    {string}      path    Path to visit.
   */
  const goTo = path => {
    // The History API is a little weird in that it requires the path argument
    // last, whereas we don't need the first (state) and second (title) arguments.
    history.pushState({}, '', path); // The history.pushState does not trigger the popstate event, but we do rely
    // on this for routing, so we want to trigger that manually.

    dispatchEvent(new PopStateEvent('popstate', {
      state: {}
    }));
  }; // Export the goTo function.

  // Import dependencies
  /**
   *  The definition of the Menu class that can be used to add a menu on top of
   *  another element.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Menu extends BaseElement {
    /**
     *  We want to keep track of the pages on which we should display this menu.
     *  @var      {array}
     */
    _pages = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element to which the select
     *                                  will be added.
     *  @param    {object}    options   Optional parameters for the select that
     *                                  is added to the form.
     *    @property   {array}   pages       These are strings that indicate the
     *                                      start of the paths of all pages that
     *                                      display this menu.
     *    @property   {Map}     navigation  These are the navigation anchors that
     *                                      will be added to the menu.
     *    @property   {Map}     shortcuts   These are the shortcut anchors that
     *                                      will be added underneath the menu.
     */

    constructor(parent, options = {}) {
      // Construct the BaseElement first.
      super(); // Create the container element.

      this._container = document.createElement("div");

      this._container.classList.add("menu"); // Create a container for the fixed menu.


      const navigation = document.createElement("nav");
      navigation.classList.add("navigation"); // Create a container for the shortcut menu.

      const shortcuts = document.createElement("div");
      shortcuts.classList.add("shortcuts"); // Store the pages.

      this._pages = options.pages; // Add the menu anchors to the right parts of the menu.

      this._addAnchors(navigation, options.navigation);

      this._addAnchors(shortcuts, options.shortcuts); // Start listening for URL changes.


      window.addEventListener('popstate', this._processPathChange); // Process the initital path.

      this._processPathChange(); // App both menu components to the container.


      this._container.appendChild(navigation);

      this._container.appendChild(shortcuts); // Add both containers to the top of the parent element.


      parent.prepend(this._container);
    }
    /**
     *  Method to process changes to the URL to reconsider if this menu should be
     *  shown or not.
     *  @param    {Event}     event       The default event object.
     *  @returns  {Menu}
     */


    _processPathChange = event => {
      // Get the current path name.
      const currentPath = window.location.pathname; // Loop through all stored pages.

      for (const page of this._pages) {
        // If the route starts with this page, we should show the menu.
        if (currentPath.startsWith(page)) return this.show();
      } // If not, we should hide.


      return this.hide();
    };
    /**
     *  Private method to add anchors to a container.
     *  @param  {Element}     parent      Container to which to add the anchors.
     *  @param  {Map}         entries     Map of anchor text, to navigation
     *                                    location for the anchors to add.
     */

    _addAnchors = (parent, entries) => {
      // Loop through the navigation anchors.
      for (const [text, location] of entries) {
        // Create the anchor.
        const anchor = document.createElement("a"); // Make the anchor tag look like a button.

        anchor.classList.add("button"); // While we will overwrite clicks on the anchor tag, we should still add
        // the href so that it can use all other uses of an anchor tag, like copy
        // link on right click and open in different tab with middle mouse click.

        anchor.setAttribute("href", location); // Add the text.

        anchor.textContent = text; // Navigate to the right page when this anchor is clicked.

        anchor.addEventListener("click", event => {
          // We don't want to use the regular click event on anchor tags to
          // navigate, as that will reload the page.
          event.preventDefault(); // Instead we use our own goTo function to navigate.

          goTo(location);
        }); // Add the anchor to the navigation menu.

        parent.append(anchor);
      }
    };
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */

    remove() {
      // Stop listening for URL changes.
      window.removeEventListener('popstate', this._processPathChange); // Call the BaseElement remove method that will remove the container.

      super.remove();
    }

  } // Export the Menu class so it can be imported elsewhere.

  /**
   *  Helper function to see if two objects are equivalent. We currently support
   *  comparing Maps, Arrays and Objects.
   *  @param    {Object}    objectA     The first object.
   *  @param    {Object}    objectB     The second object.
   *  @returns  {boolean}
   */
  const equal = (objectA, objectB) => {
    // If these are not true objects, we can simply use comparison operators to
    // make the comparison and we're done.
    if (objectA == objectB) return true; // If this is a map, we should use different logic.

    if (objectA instanceof Map) return equalMaps(objectA, objectB); // If this is an array, we should use different logic.

    if (objectA instanceof Array) return equalArrays(objectA, objectB); // If this is an object, we should apply different logic.

    if (objectA instanceof Object) return equalObjects(objectA, objectB); // We don't know what kind of objects we're dealing with, best to assume
    // they're not equal.

    return false;
  };
  /**
   *  Private method to compare two objects to see if they're the same.
   *  @param    {Object}   objectA      The first object.
   *  @param    {Object}   objectB      The second object.
   *  @returns  {boolean}
   */


  const equalObjects = (objectA, objectB) => {
    // They should both be objects, or they're not equivalent.
    if (!objectA instanceof Object || !objectB instanceof Object) return false; // Get the size of the first object.

    const objectAEntries = Object.entries(objectA); // Two objects of different sizes cannot be equivalent.

    if (objectAEntries.length != Object.keys(objectB).length) return false; // No need to check the entire object if there are no entries.

    if (objectAEntries.length == 0) return true; // Loop through all of the entries of object A to check for an equivalent
    // in object B.

    for (const [key, value] of objectAEntries) {
      // These object cannot be equal if object B does not have the same property.
      if (!objectB.hasOwnProperty(key)) return false; // Otherwise, we can check the values for equality recursively.

      if (!equal(value, objectB[key])) return false;
    } // If we found no differences, we can conclude these maps are equivalent.


    return true;
  };
  /**
   *  Private method to compare two arrays to see if they're the same.
   *  @param    {Array}   arrayA      The first array.
   *  @param    {Array}   arrayB      The second array.
   *  @returns  {boolean}
   */


  const equalArrays = (arrayA, arrayB) => {
    // They should both be arrays, or they're not equivalent.
    if (!arrayA instanceof Array || !arrayB instanceof Array) return false; // Two arrays of different sizes cannot be equivalent.

    if (arrayA.length != arrayB.length) return false; // No need to check the entire array if there are no entries.

    if (arrayA.length == 0) return true; // Loop through the keys and values of both maps simultaneously.

    for (let i = 0; i < arrayA.length; i++) {
      // Return false if any two values at the same index do not match.
      if (!equal(arrayA[i], arrayB[i])) return false;
    } // If we found no differences, we can conclude these maps are equivalent.


    return true;
  };
  /**
   *  Private method to compare two maps to see if they're the same.
   *  @param    {Map}     mapA       The first map.
   *  @param    {Map}     mapB       The second map.
   *  @returns  {boolean}
   */


  const equalMaps = (mapA, mapB) => {
    // They should both be arrays, or they're not equivalent.
    if (!mapA instanceof Map || !mapB instanceof Map) return false; // Two maps of different sizes cannot be equivalent.

    if (mapA.size != mapB.size) return false; // No need to check the entire map if there are no entries.

    if (mapA.size == 0) return true; // Get iterators of the keys and values of both maps.

    const aKeys = mapA.keys();
    const aValues = mapA.values();
    const bKeys = mapB.keys();
    const bValues = mapB.values(); // Loop through the keys and values of both maps simultaneously.

    for (let i = 0; i < mapA.size; i++) {
      // Return false if any keys or values do not match or are not in the exact
      // same order.
      if (!equal(aKeys.next().value, bKeys.next().value)) return false;
      if (!equal(aValues.next().value, bValues.next.value)) return false;
    } // If we found no differences, we can conclude these maps are equivalent.


    return true;
  }; // Export the equal function.

  // Import dependencies
  /**
   *  The definition of the View class that can be used as a container for other
   *  widgets or components that extend from the BaseElement class. You can a
   *  class name to this widget and it will then show only that widget or
   *  component. When passing a new class name, it will either remove the previous
   *  widget or keep it in cache, depending on the settings.
   *
   *  @event      any           This component will simply pass on any events
   *                            triggered by all installed widgets.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class View extends BaseElement {
    /**
     *  The current maximum number of widgets that will be kept in cache.
     *  @var      {number}
     */
    _cacheSize = null;
    /**
     *  Map for keeping track of the installed widgets. The keys in this map are
     *  the classes, where the values are objects that contain both the instance
     *  of the widget and the parameters that were used to construct it.
     *  @var      {Map}
     */

    _widgets = new Map();
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element to which the select
     *                                  will be added.
     *  @param    {object}    options   Optional parameters for the select that
     *                                  is added to the form.
     *    @property   {number}  cacheSize   The maximum number of widget that
     *                                      should be kept in cache. At least one
     *                                      widget will be kept in cache at all
     *                                      times (the active one).
     *    @property   {Class}   Widget      An optional BaseElement widget that
     *                                      will be installed immediately.
     *    @property   {any}     params      The additional options that will be
     *                                      passed to the widget.
     */

    constructor(parent, options = {}) {
      // First call the constructor of the base class.
      super(); // Store the cache size, but make sure it is at least 1.

      this._cacheSize = options.cacheSize > 1 ? options.cacheSize : 1; // Create a container for the select element.

      this._container = document.createElement("div");

      this._container.classList.add("view"); // If a widget was passed, install it immediately.


      if (options.Widget) this.install(options.Widget, ...options.params); // Add the view container to the parent element.

      parent.appendChild(this._container);
    }
    /**
     *  Method for installing a new widget.
     *  @param   {Class}   Widget     The widget that will be installed as the
     *                                active widget. It should extend the
     *                                BaseElement class.
     *  @param   {...any}  params     The additional options that will be passed
     *                                to the widget.
     *  @returns {View}
     */


    install(Widget, ...params) {
      // Check if we've installed a widget with this class before.
      if (!this._widgets.has(Widget)) {
        // If we're adding a new widget, we'll also activate it. But we never want
        // more than one widget active, so we should hide the currently active
        // widget first.
        const active = this._activeWidget();

        if (active) active.instance.hide(); // If not, create an instance of this widget.

        const instance = new Widget(this._container, ...params); // Make sure we propagate all events that this widget triggers.

        instance.bubbleTo(this); // And add the widget and its parameters to the Map, using the class as a
        // key.

        this._widgets.set(Widget, {
          instance,
          params
        }); // If we have more widgets that the maximum cache size allows, clear one
        // widget.


        if (this._widgets.size > this._cacheSize) this._cullWidget();
      } // Now activate the the requested widget with the requested parameters.


      this._activate(Widget, params); // Allow chaining.


      return this;
    }
    /**
     *  Private method for exposing the currently active widget.
     *  @returns  {BaseElement|false}
     */


    _activeWidget() {
      // Return the last widget in the map.
      if (this._widgets.size) return Array.from(this._widgets).pop()[1]; // Return false if there is no active widget.
      else return false;
    }
    /**
     *  Private method for activating a widget.
     *  @param   {Class}    Widget    The widget that will be activated.
     *  @param   {object}   params    The additional options that were passed
     *                                to the widget.
     */


    _activate(Widget, params) {
      // Cannot activate a widget if we don't have a Widget.
      if (!Widget) return; // Hide the widget that is currently active.

      this._activeWidget().instance.hide(); // First, get the instantiated widget.


      const widget = this._widgets.get(Widget); // Now remove the previous entry for this widget from the Map.


      this._widgets.delete(Widget); // If the parameters for this widget have changed, we need to create a new
      // instance.


      if (!equal(widget.params, params)) {
        // Remember the new parameters.
        widget.params = params; // Remove the previous instance.

        widget.instance.remove(); // Create the new instance of the same class.

        widget.instance = new Widget(this._container, ...params);
      } // And add it as the newest one. This will make sure that the widgets that
      // are not used are the first to be removed if the cache size is exceeded.


      this._widgets.set(Widget, widget); // Now show the newly activated widget.


      widget.instance.show();
    }
    /**
     *  Private method that removes the the widget that has been inactive the
     *  longest.
     */


    _cullWidget() {
      // Get the first widget object and its class constructor in the map.
      const [Class, widget] = Array.from(this._widgets)[0]; // Use the class constructor to remove the widget object from the map.

      this._widgets.delete(Class); // Now clean up the widget itself.


      widget.instance.remove();
    }
    /**
     *  Method to clean the view of all installed widgets.
     *  @returns  {View}
     */


    clear() {
      // Remove all installed widgets.
      for (const [Class, widget] of this._widgets) widget.instance.remove(); // Clear the map.


      this._widgets.clear(); // Allow chaining.


      return this;
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // First clear the view of all installed widgets.
      this.clear(); // Call the BaseElement's remove function.

      super.remove();
    }

  } // Export the View class so it can be imported elsewhere.

  /**
   *  Helper function to get access to the local cookies.
   *  @returns  {Object}
   */
  const getCookies = () => {
    // Get all the cookies as an object.
    return document.cookie.split('; ').reduce((accumulator, current) => {
      // Split them by the equals operator.
      const [key, value] = current.split('='); // Assign the key value combination for each cookie to the object.

      accumulator[key] = value; // Return the object to keep checking.

      return accumulator;
    }, {});
  }; // Export the getCookies function.

  // Import dependencies
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
      super(); // Store the initial routes.

      for (const route of routes.keys()) this.add(route, routes.get(route)); // Store the protected routes.


      this._protected = options.protected; // Start listening for URL changes.

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
     *  Method to check if the user is currently logged in. We can check this by
     *  checking the cookie that is set when logging in. This cookie does not
     *  contain the actual authorization token, but is simply a client-side
     *  indication to see if we should still be logged in.
     *  @returns  {boolean}
     */

    _loggedIn = () => {
      // We should have a cookie that says we're logged in.
      return !!getCookies()['xsrfToken'];
    };
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
      const authorized = this._loggedIn() || true; // If the user is not authorized, see if this path is protected.

      if (!authorized) for (const protectedPath of this._protected) {
        // If the path starts with a protected path, trigger a 'not-allowed'
        // event.
        if (path.startsWith(protectedPath)) return this.trigger("not-allowed");
      } // Loop through the routes to find a matching entry.

      for (const [route, entry] of this._routes.entries()) {
        // Try to match this path against the pattern for this route.
        const match = path.match(entry.pattern); // If there was no match, we should continue looking.

        if (!match) continue; // Initialize an object to hold the variables.

        const variables = {}; // The match should contain the full match and the discovered variables.
        // Here, we only care about the variables, so we drop the first item from
        // the array.

        match.shift(); // Loop through the indices of the variables.

        for (let i = 0; i < match.length; i++) {
          // Add each variable to the variables in the route entry.
          variables[entry.variables[i]] = match[i];
        } // Trigger the navigate event for this component and these variables.
        // Allow chaining.


        return this.trigger("navigate", {
          // Supply the component for this route entry. This should be the class
          // of the component.
          component: entry.component,
          // Add the variables to the options object.
          options: Object.assign({}, entry.options, variables)
        });
      } // Otherwise, we should trigger the not found error. Allow chaining.


      return this.trigger("not-found");
    };
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
        component: Component,
        pattern,
        options,
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

  // Import dependencies.
  /**
   *  The definition of the Apology class that can be used to create an apology
   *  message. This can be used to explain to a user why something cannot be
   *  displayed.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Apology extends BaseElement {
    /**
     *  Reference to the header element we are using.
     *  @var      {Element}
     */
    _title = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element on which the
     *                                  overlay interface will be installed.
     *  @param    {string}    message   Message to display to the user.
     *  @param    {Object}    link      Optional link for navigation.
     *    @property {string}    text      The text to display for the link.
     *    @property {string}    location  Where to navigate to.
     */

    constructor(parent, message, link) {
      // Call the base class constructor.
      super(); // Create a container for the overlay.

      this._container = document.createElement("div");

      this._container.classList.add("apology"); // Create the message to display.


      this._title = document.createElement("h1");
      this._title.textContent = message; // Add the message.

      this._container.appendChild(this._title); // Add the link if requested.


      if (link) this.addLink(link.text, link.location); // Add the overlay to the parent container.

      parent.appendChild(this._container);
    }
    /**
     *  Method to update the current message.
     *  @param      {string}    message   The new message to install.
     *  @returns    {Apology}
     */


    update = message => {
      // Install the new message by overwriting the previous one.
      this._title.textContent = message; // Allow chaining.

      return this;
    };
    /**
     *  Private method to add anchors to a container.
     *  @param  {string}      text        The text for the link.
     *  @param  {string}      location    The location to which the link should
     *                                    redirect.
     */

    addLink = (text, location) => {
      // Create the anchor.
      const anchor = document.createElement("a"); // Make the anchor tag look like a button.

      anchor.classList.add("button"); // While we will overwrite clicks on the anchor tag, we should still add
      // the href so that it can use all other uses of an anchor tag, like copy
      // link on right click and open in different tab with middle mouse click.

      anchor.setAttribute("href", location); // Add the text.

      anchor.textContent = text; // Navigate to the right page when this anchor is clicked.

      anchor.addEventListener("click", event => {
        // We don't want to use the regular click event on anchor tags to
        // navigate, as that will reload the page.
        event.preventDefault(); // Instead we use our own goTo function to navigate.

        goTo(location);
      }); // Add the anchor to the navigation menu.

      this._container.appendChild(anchor);
    };
    /**
     *  Method to remove the current object.
     */

    remove() {
      // Remove the title.
      if (this._title) this._title.remove(); // Let the BaseElement remove the container.

      super.remove();
    }

  } // Export the Apology class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Request class that can be used to perform HTTP
   *  requests.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Request {
    /**
     *  This is a path to the location of the API.
     *  @var      {string}
     */
    _apiUrl = '';
    /**
     *  This is a path to the location of the object storage.
     *  @var      {string}
     */

    _storageUrl = '';
    /**
     *  Class constructor.
     */

    constructor() {
      // Construct the root URL.
      const origin = window.location.protocol + "//" + window.location.host; // Construct the link to the API.

      this._apiUrl = origin + "/api"; // Construct the link to the models bucket of the object storage.

      this._storageUrl = origin + "/models";
    }
    /**
     *  Method to craft the URL to reach a model.
     *  @param    {string}    id      We need to know a model's ID to craft the
     *                                URL.
     *  @returns  {string}
     */


    model = id => {
      // Create the URL from the object storage, the models bucket, ID as the
      // filename and add the GLB extension.
      return this._storageUrl + '/' + id + '.glb';
    };
    /**
     *  Private method to check for common errors. We do this because our widgets
     *  expect promises to fail when things go wrong, but fetch only fails the
     *  promise if connection errors happen.
     *  @param    {Promise}  request  Fetch API request.
     *  @returns  {Promise}
     */

    _errorCheck = async request => {
      // Wait for the response to arrive.
      const response = await request; // Check if the response was rejected for too many requests.

      if (response.status == 429) throw new Error("Received too many requests. Try again later."); // Check if the response was rejected for too many requests.

      if (response.status == 401) throw new Error("Request not allowed. You need to be logged in."); // If we found no known errors, we can pass on the response.

      return response;
    };
    /**
     *  Private method to get the XSRF token from the cookies.
     *  @returns  {string}
     */

    _xsrfToken = () => {
      return getCookies()['xsrfToken'];
    };
    /**
     *  Method for performing a PUT request. Returns a promise that will
     *  resolve in a Response object.
     *  @param    {string}    url       URL that points to the API endpoint.
     *  @returns  {Promise}
     */

    get = async (url = '') => {
      // Use fetch to perform the HTTP request.
      return this._errorCheck(fetch(this._apiUrl + url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': this._xsrfToken()
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
      }));
    };
    /**
     *  Method for performing a PUT request. Returns a promise that will
     *  resolve in a Response object.
     *  @param    {string}    url     URL that points to the API endpoint.
     *  @param    {object}    data    Object containing the HTTP request
     *                                parameters.
     *  @returns  {Promise}
     */

    put = async (url = '', data = {}) => {
      // First, encode all files in the data as we can only send over strings in
      // JSON format.
      return this._encodeFiles(data).then(encoded => {
        // Use fetch to perform the HTTP request.
        return this._errorCheck(fetch(this._apiUrl + url, {
          method: 'PUT',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': this._xsrfToken()
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(encoded)
        }));
      });
    };
    /**
     *  Method for performing a POST request. Returns a promise that will
     *  resolve in a Response object.
     *  @param    {string}    url     URL that points to the API endpoint.
     *  @param    {object}    data    Object containing the HTTP request
     *                                parameters.
     *  @returns  {Promise}
     */

    post = async (url = '', data = {}) => {
      // First, encode all files in the data as we can only send over strings in
      // JSON format.
      return this._encodeFiles(data).then(encoded => {
        // Use fetch to perform the HTTP request.
        return this._errorCheck(fetch(this._apiUrl + url, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': this._xsrfToken()
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(encoded)
        }));
      });
    };
    /**
     *  Method for performing a DELETE request. Returns a promise that will
     *  resolve in a Response object.
     *  @param    {string}    url     URL that points to the API endpoint.
     *  @returns  {Promise}
     */

    delete = async (url = '') => {
      // Use fetch to perform the HTTP request.
      return this._errorCheck(fetch(this._apiUrl + url, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': this._xsrfToken()
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
      }));
    };
    /**
     *  Private helper method to go through an object's entries and encode all
     *  files in the object.
     *  @param    {Object}    object    The object that might contain file
     *                                  entries.
     *  @returns  {Promise}
     */

    _encodeFiles = async object => {
      // Return a promise that resolves into the encoded object.
      return new Promise((resolve, reject) => {
        // Encoding files might fail.
        try {
          // We want to start a new object.
          const encoded = {}; // Gather an array of promises for encoding files.

          const promises = []; // Loop through all the object entries to build the new object.

          for (const [key, value] of Object.entries(object)) {
            // If the input value is a file, we want to encode it as a base64
            // string that we can send along in an HTTP request.
            if (value instanceof File) {
              // Store the promise for encoding this file.
              promises.push(this._encodeFile(value).then(dataObject => {
                encoded[key] = dataObject;
              })); // Otherwise, we can use it as is.
            } else encoded[key] = value;
          } // Return the new object we built after all files have been encoded.


          Promise.all(promises).then(() => void resolve(encoded)); // Reject the promise if any errors occur.
        } catch (error) {
          reject(error);
        }
      });
    };
    /**
     *  Private helper method to encode files using base64.
     *  @param    {File}      file    The file to encode.
     *  @return   {Promise}
     */

    _encodeFile = async file => {
      // Return a Promise that resolves into the data string.
      return new Promise((resolve, reject) => {
        // Get a file reader object that to read our file.
        const reader = new FileReader(); // Install an event listener to return the encoded file object as soon as
        // the file has been read successfully.

        reader.onload = () => void resolve({
          // Add the base64 encoded file property.
          file: reader.result,
          // Also add the extension from the file name.
          extension: file.name.split('.').pop()
        }); // Install event listeners to listen for when we fail to read the file.


        reader.onerror = error => void reject(error);

        reader.onabort = abort => void reject(abort); // Now read the file as a data URL.


        reader.readAsDataURL(file);
      });
    };
    /**
     *  There is nothing to remove here, but this method is expected on every
     *  class as the inner workings of this class is assumed to be unknown.
     */

    remove() {}

  } // Export the Request class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Select class that can be used to create select
   *  elements for in a form.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class FormSelect extends BaseElement {
    /**
     *  Arrayfor keeping track of the options in the select element.
     *  @var      {array}
     */
    _options = [];
    /**
     *  Class constructor.
     *  @param    {Element}   parent      The parent element to which the select
     *                                    will be added.
     *  @param    {object}    options     Optional parameters for the select that
     *                                    is added to the form.
     *    @property   {string}  name        Registration name of the select. This
     *                                      should uniquely identify the select.
     *    @property   {string}  placeholder This is the placeholder option that
     *                                      will be shown to the user.
     *    @property   {string}  tooltip     A short explanation about the input.
     *    @property   {string}  required    Should this always have a value when
     *                                      submitting?
     *    @property   {string}  multiple    Should a user be able to select
     *                                      multiple options?
     *    @property   {array}   options     An array of options to add to the
     *                                      select element.
     */

    constructor(parent, options = {}) {
      // First call the constructor of the base class.
      super(); // Create a container for the select element.

      this._container = document.createElement("select"); // Pass on any change events.

      this._container.addEventListener("change", event => void this.trigger("change", event)); // Set the optional attributes.


      if (options.name) this._container.name = options.name;
      if (options.required) this._container.setAttribute("required", true);
      if (options.disabled) this.disabled(options.disabled);
      if (options.multiple) this._container.setAttribute("multiple", true);
      if (options.tooltip) this._container.setAttribute("title", options.tooltip); // Should we set a placeholder?

      if (options.placeholder) {
        // Add the placeholder as a disabled option to get a placeholder value.
        const placeholder = this.addOption('', options.placeholder); // Make sure this is the one that's selected by default.

        placeholder.selected = true; // Make sure it cannot be selected.

        placeholder.disabled = true; // Make sure it is hidden in the dropdown menu.

        placeholder.hidden = true;
      } // Add all the options we get.


      if (options.options) for (const option of options.options) this.addOption(option.value, option.label); // Add the input element to the parent element.

      parent.appendChild(this._container);
    }
    /**
     *  Method for getting the current value of this element. Can be used as both
     *  a getter and a setter.
     *
     *  @getter
     *    @return   {string}
     *
     *  @setter
     *    @param    {string}      newValue    The new value for this element.
     *    @return   {FormInput}
     */


    value = newValue => {
      // If used as a getter, return the value of the input.
      if (newValue === undefined) {
        // Don't return anything if no selection was made.
        if (!this._container.selectedOptions.length) return ''; // Don't return a value for the placeholder option.

        if (this._container.selectedOptions[0].disabled) return ''; // Otherwise, we can return the value.

        return this._container.value;
      } // Set the requested value.


      this._container.value = newValue; // Allow chaining.

      return this;
    };
    /**
     *  Method for getting the label of the currently selected options.
     *  @returns   {array}
     */

    labels = () => {
      // Get all selected options.
      const options = this._container.selectedOptions; // Convert the HTMLCollection to an array and return an array of strings
      // with the text content of each option.

      return [...options].map(option => option.textContent);
    };
    /**
     *  Method for disabling/enabling this element. Can be used as both a getter
     *  and a setter.
     *
     *  @getter
     *    @return   {boolean}
     *
     *  @setter
     *    @param    {boolean} disable     Should this element be disabled?
     *    @return   {FormSelect}
     */

    disabled = disable => {
      // If used as a getter, return the disabled state of the form select.
      if (disable === undefined) return this._container.disabled; // Set the requested attribute.

      this._container.disabled = disable; // Allow chaining.

      return this;
    };
    /**
     *  Method for adding an option element to the select element.
     *  @param    {string}  value       This is the value of the option that is
     *                                  communicated to the API endpoint.
     *  @param    {string}  label       This is the label of the options that is
     *                                  shown to the user.
     *  @returns  {Element}
     */

    addOption = (value, label) => {
      // We cannot add an option without a label.
      if (!label) return; // Create the option element.

      const option = document.createElement("option");
      if (value) option.value = value;
      option.textContent = label; // Add the option to our list. We allow duplicates of any kind.

      this._options.push(option); // Add the option to the select element so that we can show it to the user.


      this._container.appendChild(option); // Expose the option object.


      return option;
    };
    /**
     *  Method to remove all options.
     *  @returns  {FormSelect}
     */

    clear = () => {
      // Remove all options, if we have any.
      for (const option of this._options) option.remove(); // Remove all references to the options.


      this._options = []; // Allow chaining.

      return this;
    };
    /**
     *  We need to append the remove method to clean up other elements we've
     *  added. We have to use non-arrow function or we'd lose the super context.
     */

    remove() {
      // First, clear out all the options.
      this.clear(); // Call the original remove method. This also removes the container.

      super.remove();
    }

  } // Export the FormSelect class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Button class that can be used to create button
   *  elements.
   *
   *  @event      click         Triggered when the button is clicked.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Button extends BaseElement {
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element to which the button
     *                                  element will be added.
     *  @param    {object}    options   Optional parameters for the element that
     *                                  is added to the form.
     *    @property   {string}  type      This is the type of the button that is
     *                                    added.
     *                                    Default: 'text'
     *    @property   {string}  label     This is the label of the element that
     *                                    will be shown to the user.
     *    @property   {boolean} disabled  Should this button be disabled by
     *                                    default?
     */
    constructor(parent, options = {}) {
      // First call the constructor of the base class.
      super(); // Create a container for the button element.

      this._container = document.createElement("button");
      if (options.type) this._container.setAttribute("type", options.type);
      if (options.label) this._container.textContent = options.label;
      if (options.disabled) this.disabled(options.disabled); // Add the event listener to the button.

      this._container.addEventListener("click", this._onClick); // Add the button element to the parent element.


      parent.appendChild(this._container);
    }
    /**
     *  Definition of an event handler for button clicks.
     *  @param    {Event}     event     The normal HTML click event.
     */


    _onClick = event => {
      // Trigger the event handler to bubble this event.
      this.trigger("click", event);
    };
    /**
     *  Method for disabling/enabling this element. Can be used as both a getter
     *  and a setter.
     *
     *  @getter
     *    @return   {boolean}
     *
     *  @setter
     *    @param    {boolean} disable     Should this element be disabled?
     *    @return   {FormSelect}
     */

    disabled = disable => {
      // If used as a getter, return the disabled state of the form select.
      if (disable === undefined) return this._container.disabled; // Set the requested attribute.

      this._container.disabled = disable; // Allow chaining.

      return this;
    };
    /**
     *  Method to remove this object and clean up after itself.
     */

    remove = () => {
      // Remove the event listener first.
      this._container.removeEventListener("click", this._onClick); // Then let the parent element clean up the container.


      super.remove();
    };
  } // Export the Button class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the MultiSelect class that can be used to create a custom
   *  input element that allows users to select an array of values.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class FormMultiSelect extends BaseElement {
    /**
     *  Hidden select element for keeping track of all selected options.
     *  @var      {array}
     */
    _hiddenSelect = [];
    /**
     *  Array for keeping track of all possible options.
     *  @var      {array}
     */

    _options = [];
    /**
     *  Reference to the add button.
     *  @var      {Button}
     */

    _add = null;
    /**
     *  Reference to the clear button.
     *  @var      {Button}
     */

    _clear = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      The parent element to which the select
     *                                    will be added.
     *  @param    {object}    options     Optional parameters for the select that
     *                                    is added to the form.
     *    @property   {string}  name        Registration name of this input. This
     *                                      should uniquely identify this input.
     *    @property   {string}  label       This is the label of the element that
     *                                      will be shown to the user.
     *    @property   {string}  placeholder This is the placeholder option that
     *                                      will be shown to the user.
     *    @property   {string}  tooltip     A short explanation about the input.
     *    @property   {array}   options     An array of options to add to the
     *                                      select element.
     */

    constructor(parent, options = {}) {
      // First call the constructor of the base class.
      super(); // Create a container for this widget. We are going to use a few different
      // elements that may not immediately look like they belong together. We can
      // solve this by wrapping them in a fieldset.

      this._container = document.createElement("fieldset"); // Set the tooltip if provided.

      if (options.tooltip) this._container.setAttribute("title", options.tooltip); // Some browsers will not allow certain styling on fieldsets and we do want
      // this control. So to fix this, we wrap the input elements in a separate
      // div.

      const inputs = document.createElement("div");
      inputs.classList.add("multiselect");

      this._container.appendChild(inputs); // Add a label if provided.


      if (options.label) this.label(options.label); // Create a select input element with the options. We don't immediately want
      // to add all options.

      this._select = new FormSelect(inputs, {
        label: options.label
      }); // Create a hidden select to submit the data.

      this._createHiddenField(options); // Instead we use our own method so that we can keep references to the
      // options.


      if (options.options) for (const option of options.options) this.addOption(option); // Create a button to add the model that's currently selected.

      this._add = new Button(inputs, {
        label: 'Add',
        disabled: true
      }).on('click', this.selectCurrent); // Listen for selection changes.

      this._select.on("change", this._checkAddState); // Create a container to show the current selections.


      this._selectionDisplay = document.createElement("div");

      this._selectionDisplay.classList.add("selections"); // Add the selection display to this container.


      inputs.appendChild(this._selectionDisplay); // Create a button to reset all selected options.

      this._clear = new Button(inputs, {
        label: 'Clear',
        type: 'reset',
        disabled: true
      }).on('click', this.reset); // Add the the container to the parent element.

      parent.appendChild(this._container);
    }
    /**
     *  Method for adding or updating label. Since we wrapped this input in a
     *  fieldset we can use the legend to add a label.
     *  @param    {string}    newLabel  Optional string for the legend text. When
     *                                  no argument or an empty string is
     *                                  provided, the legend will be removed.
     *  @returns  {FormMultiSelect}
     */


    label = newLabel => {
      // Do we already have a legend element?
      if (this._legend) {
        // Was a new label provided? Then we want to update the legend element.
        if (newLabel) this._legend.textContent = newLabel; // Was no new label provided? Then we can remove the legend element.
        else this._legend.remove(); // Is there no legend element yet?
      } else {
        // If a new label was provided, we should create the legend element.
        if (newLabel) {
          // Create the legend.
          this._legend = document.createElement("legend"); // Add the new label text.

          this._legend.textContent = newLabel; // Add the legend to the fieldset.

          this._container.prepend(this._legend);
        }
      } // Allow chaining.


      return this;
    };
    /**
     *  Helper method to create a hidden select input that will serve to hold the
     *  selections are to submit data.
     *  @param    {object}    options   Optional parameters for the select that
     *                                  is added to the form.
     *    @property   {string}  name      Registration name of the select. This
     *                                    should uniquely identify the select.
     *    @property   {string}  label     This is the label of the element that
     *                                    will be shown to the user.
     *    @property   {array}   options   An array of options to add to the select
     *                                    element.
     */

    _createHiddenField = options => {
      // Create a hidden multiselect field.
      this._hiddenSelect = document.createElement("select"); // Make sure it is hidden.

      this._hiddenSelect.setAttribute('hidden', ''); // Make sure we can select multiple options.


      this._hiddenSelect.setAttribute('multiple', true); // Add the name for submit events.


      this._hiddenSelect.name = options.name; // Add all options.

      if (options.options) for (const option of options.options) this._addHiddenOption(option.value, option.label); // Add the hidden field to the container.

      this._container.appendChild(this._hiddenSelect);
    };
    /**
     *  Add an option to the hidden field.
     *  @param    {string}  value       This is the value of the option that is
     *                                  communicated to the API endpoint.
     *  @param    {string}  label       This is the label of the options that is
     *                                  shown to the user.
     *  @returns  {FormMultiSelect}
     */

    _addHiddenOption = (value, label) => {
      // Create the option element.
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label; // Add the option to the hidden select.

      this._hiddenSelect.appendChild(option);
    };
    /**
     *  Helper method to check if we should enable the add button.
     *  @returns  {Button}
     */

    _checkAddState = () => {
      // See which option is currently being selected.
      const option = this._select.value(); // Don't select the default selection.


      if (!option) return this._add.disabled(true); // Check if this option is already selected.

      const selected = this.value().includes(option); // The user should be able to add new selections only when they're not
      // already selected.

      return this._add.disabled(selected);
    };
    /**
     *  Select handler to select whatever option is currently selected by the
     *  select input.
     *  @param    {Event}     event       Default click event.
     *  @returns  {FormMultiSelect}
     */

    selectCurrent = event => {
      // Make sure we don't reset the entire form.
      event.preventDefault(); // Get the selected value.

      const value = this._select.value(); // Get the selected label.


      const label = this._select.labels()[0]; // Select these options and allow chaining.


      return this.select(value, label);
    };
    /**
     *  Reset handler.
     *  @param    {Event}     event       Default click event.
     *  @returns  {FormMultiSelect}
     */

    reset = event => {
      // Make sure we don't reset the entire form.
      event.preventDefault(); // Clear this widget and allow chaining.

      return this.clear();
    };
    /**
     *  Function to select the
     *  @param    {string}  value       This is the value of the option that is
     *                                  communicated to the API endpoint.
     *  @param    {string}  label       This is the label of the options that is
     *                                  shown to the user.
     *  @returns  {FormMultiSelect}
     */

    select = (value, label) => {
      // Select this value.
      this._selectHidden(value); // Check if we should still enable the add state.


      this._checkAddState(); // When there are selections, they can be cleared.


      this._clear.disabled(false); // Create a new element to show the newly added selection.


      const selection = document.createElement('p'); // Add the selection class for custom styling.

      selection.classList.add('selection'); // Add the label as an indicator of this selection.

      selection.textContent = label; // Add the new selection.

      this._selectionDisplay.appendChild(selection); // Allow chaining.


      return this;
    };
    /**
     *  Helper method to select a hidden option.
     *  @param  {string}    value     The value of the option to select.
     */

    _selectHidden = value => {
      // Loop through the options to find one to match the value.
      for (const option of this._hiddenSelect.options) {
        // Select all options that match this value.
        if (option.value == value) option.setAttribute("selected", true);
      }
    };
    /**
     *  Method for getting the current values of this element. Can be used as both
     *  a getter and a setter.
     *
     *  @getter
     *    @return   {array}
     *
     *  @setter
     *    @param    {array}       newValues   The new selections for this element.
     *    @return   {FormInput}
     */

    value = newValues => {
      // If used as a getter, return the values of the selected options.
      if (newValues === undefined) {
        // Get the list of options from the hidden select element.
        const options = [...this._hiddenSelect.selectedOptions]; // Return an array of values.

        return options.map(option => option.value);
      } // Select all values.


      for (const value of newValues) this.select(value._id, value.name); // Allow chaining.


      return this;
    };
    /**
     *  Method for disabling/enabling this element. Can be used as both a getter
     *  and a setter.
     *
     *  @getter
     *    @return   {boolean}
     *
     *  @setter
     *    @param    {boolean} disable     Should this element be disabled?
     *    @return   {FormMultiSelect}
     */

    disabled = disable => {
      // If used as a getter, return the disabled state of the fieldset.
      if (disable === undefined) return this._container.disabled; // Set the requested attribute on the fieldset and the hidden select input.

      this._container.disabled = disable;
      this._hiddenSelect.disabled = disable; // Set the requested attribute on the buttons.

      this._add.disabled = disable;
      this._clear.disabled = disable; // Set the request state on the select widget.

      this._select.disabled(disable); // Allow chaining.


      return this;
    };
    /**
     *  Method for adding an option element to the select element.
     *  @param    {string}  value       This is the value of the option that is
     *                                  communicated to the API endpoint.
     *  @param    {string}  label       This is the label of the options that is
     *                                  shown to the user.
     *  @returns  {Element}
     */

    addOption = (value, label) => {
      // Add the option to our hidden select field.
      this._addHiddenOption(value, label); // Add the option to the select input.


      const option = this._select.addOption(value, label); // Store the option in our options array.


      this._options.push(option); // Check if the add button should be enabled.


      this._checkAddState(); // Expose the option.


      return option;
    };
    /**
     *  Method to remove all options.
     *  @returns  {FormMultiSelect}
     */

    clear = () => {
      // Unselect all options.
      for (const option of this._hiddenSelect.options) option.removeAttribute("selected"); // When there are no selections, they cannot be cleared.


      this._clear.disabled(true); // Remove all current selections for our display.


      while (this._selectionDisplay.firstChild) this._selectionDisplay.removeChild(this._selectionDisplay.lastChild); // Check if we should still enable the add state.


      this._checkAddState(); // Allow chaining.


      return this;
    };
    /**
     *  We need to append the remove method to clean up other elements we've
     *  added. We have to use non-arrow function or we'd lose the super context.
     */

    remove() {
      // First, clear out all the options.
      this.clear(); // Remove all widgets we've instantiated.

      if (this._select) this._select.remove(); // Remove DOM elements.

      if (this._hiddenSelect) this._hiddenSelect.remove(); // Call the original remove method. This also removes the container.

      super.remove();
    }

  } // Export the FormMultiSelect class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Input class that can be used to create input elements.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class FormInput extends BaseElement {
    /**
     *  A private variable reference to the select object.
     *  @var    {Select}
     */
    _select = null;
    /**
     *  To link an input and a label together, we need to have a unique ID.
     *  @var    {string}
     */

    _id = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element to which the input
     *                                  element will be added.
     *  @param    {object}    options   Optional parameters for the element that
     *                                  is added to the form.
     *    @property   {string}  name      Registration name of the input. This is
     *                                    also used in the API call and should
     *                                    uniquely identify the input.
     *    @property   {string}  type      This is the type of the input that is
     *                                    added.
     *    @property   {string}  label     This is the label of the element that
     *                                    will be shown to the user.
     *    @property   {string}  step      Applicable to number only: by which
     *                                    increment should the number increase?
     *    @property   {boolean} disabled  Should this input be disabled by
     *                                    default?
     *    @property   {string}  tooltip   A short explanation about the input.
     *    @property   {array}   options   An array of options to add to the select
     *                                    element. This is only used when the
     *                                    type is 'select'.
     */

    constructor(parent, options = {}) {
      // First call the constructor of the base class.
      super(); // Assign a unique ID to this input object.

      this._id = 'input-' + this._uuidv4(); // Depending on the input type, we may need to create a different element.

      switch (options.type) {
        // Should we create a texarea element?
        case "textarea":
          this._createTextarea(parent, options);

          break;
        // Should we create an file upload button?

        case "file":
          this._createFileButton(parent, options);

          break;
        // Should we create a select element?

        case "select":
          this._createSelect(parent, options);

          break;
        // Should we create a multiselect element?

        case "multiselect":
          this._createMultiSelect(parent, options);

          break;
        // Otherwise, create a default input element.

        default:
          this._createInput(parent, options);

      }
    }
    /**
     *  Method for creating a unique ID.
     *  @returns  {string}
     */


    _uuidv4 = () => {
      // Based this GitHub repository: https://gist.github.com/jed/982883
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    };
    /**
     *  Private method for creating a default input.
     *  @param    {Element}   parent    The parent element to which the input
     *                                  element will be added.
     *  @param    {object}    options   Optional parameters for the element that
     *                                  is added to the form.
     *    @property   {string}  name      Registration name of the input. This is
     *                                    also used in the API call and should
     *                                    uniquely identify the input.
     *    @property   {string}  type      This is the type of the input that is
     *                                    added.
     *    @property   {string}  label     This is the label of the element that
     *                                    will be shown to the user.
     *    @property   {string}  step      Applicable to number only: by which
     *                                    increment should the number increase?
     *    @property   {boolean} disabled  Should this input be disabled by
     *                                    default?
     *    @property   {string}  tooltip   A short explanation about the input.
     */

    _createInput = (parent, options) => {
      // Create a container for the input element.
      this._container = document.createElement("div");

      this._container.classList.add("input-field"); // Set the tooltip if provided.


      if (options.tooltip) this._container.setAttribute("title", options.tooltip); // Create the input element.

      this._input = document.createElement("input");
      this._input.id = this._id;
      this._input.name = options.name;

      this._input.setAttribute("type", options.type || 'text');

      this._input.setAttribute("placeholder", options.label); // Install the optional attributes.


      if (options.required) this._input.setAttribute("required", true);
      if (options.disabled) this.disabled(options.disabled);
      if (options.step) this._input.setAttribute("step", options.step); // Create the label element.

      this._label = document.createElement("label");

      this._label.setAttribute("for", this._id); // Add a text element to the label.


      const labelText = document.createElement("span");
      labelText.textContent = options.label;

      this._label.appendChild(labelText); // Add the input and the label to the container.


      this._container.appendChild(this._input);

      this._container.appendChild(this._label); // Add the input element to the parent element.


      parent.appendChild(this._container);
    };
    /**
     *  Private method for creating a textarea element.
     *  @param    {Element}   parent    The parent element to which the input
     *                                  element will be added.
     *  @param    {object}    options   Optional parameters for the element that
     *                                  is added to the form.
     *    @property   {string}  name      Registration name of the input. This is
     *                                    also used in the API call and should
     *                                    uniquely identify the input.
     *    @property   {string}  type      This is the type of the input that is
     *                                    added.
     *    @property   {string}  label     This is the label of the element that
     *                                    will be shown to the user.
     *    @property   {boolean} disabled  Should this input be disabled by
     *                                    default?
     *    @property   {string}  tooltip   A short explanation about the input.
     */

    _createTextarea = (parent, options) => {
      // Create a container for the input element.
      this._container = document.createElement("div");

      this._container.classList.add("input-field"); // Set the tooltip if provided.


      if (options.tooltip) this._container.setAttribute("title", options.tooltip); // Create the input element.

      this._input = document.createElement("textarea");
      this._input.id = this._id;
      this._input.name = options.name;

      this._input.setAttribute("type", options.type);

      this._input.setAttribute("placeholder", options.label); // Install the optional attributes.


      if (options.required) this._input.setAttribute("required", true);
      if (options.disabled) this.disabled(options.disabled); // Create the label element.

      this._label = document.createElement("label");

      this._label.setAttribute("for", this._id); // Add a text element to the label.


      const labelText = document.createElement("span");
      labelText.textContent = options.label;

      this._label.appendChild(labelText); // Add the input and the label to the container.


      this._container.appendChild(this._input);

      this._container.appendChild(this._label); // Add the input element to the parent element.


      parent.appendChild(this._container);
    };
    /**
     *  Private method for creating a file upload button.
     *  @param    {Element}   parent    The parent element to which the input
     *                                  element will be added.
     *  @param    {object}    options   Optional parameters for the element that
     *                                  is added to the form.
     *    @property   {string}  name      Registration name of the input. This is
     *                                    also used in the API call and should
     *                                    uniquely identify the input.
     *    @property   {string}  type      This is the type of the input that is
     *                                    added.
     *    @property   {string}  label     This is the label of the element that
     *                                    will be shown to the user.
     *    @property   {string}  accept    A string describing the file types that
     *                                    will be accepted.
     *    @property   {boolean} disabled  Should this button be disabled by
     *                                    default?
     *    @property   {string}  tooltip   A short explanation about the input.
     */

    _createFileButton = (parent, options) => {
      // Create a container for the input element.
      this._container = document.createElement("div");

      this._container.classList.add("file-button"); // Set the tooltip if provided.


      if (options.tooltip) this._container.setAttribute("title", options.tooltip); // Create the input element.

      this._input = document.createElement("input");
      this._input.id = this._id;
      this._input.name = options.name;

      this._input.setAttribute("type", options.type); // Install the optional attributes.


      if (options.accept) this._input.setAttribute("accept", options.accept);
      if (options.required) this._container.setAttribute("required", true);
      if (options.disabled) this.disabled(options.disabled); // Create the label element.

      const label = document.createElement("label");
      label.setAttribute("for", this._id); // Add a text element to the label.

      const labelText = document.createElement("span");
      labelText.textContent = options.label;
      label.appendChild(labelText); // Listen for when a file is selected. We want to show the filename for
      // selected files.

      this._input.addEventListener("change", () => {
        // Get the list of selected files.
        const selected = this._input.files; // Install the label when no files are selected.

        if (!selected.length) label.textContent = options.label;else {
          // Get the selected File object.
          const file = selected[0]; // Update the label text.

          label.textContent = `${file.name} (${file.size} bytes)`;
        }
      }); // Add the input element and the label directly to the parent element.


      this._container.appendChild(this._input);

      this._container.appendChild(label);

      parent.appendChild(this._container);
    };
    /**
     *  Private method for creating a select element.
     *  @param    {Element}   parent    The parent element to which the select
     *                                  element will be added.
     *  @param    {object}    options   Optional parameters for the element that
     *                                  is added to the form.
     *    @property   {string}  name      Registration name of the select. This
     *                                    should uniquely identify the select.
     *    @property   {array}   options   An array of options to add to the select
     *                                    element.
     *    @property   {string}  label     This is the label of the element that
     *                                    will be shown to the user.
     *    @property   {string}  tooltip   A short explanation about the input.
     */

    _createSelect = (parent, options) => {
      // Create the select element.
      this._container = new FormSelect(parent, options);
    };
    /**
     *  Private method for creating a multiselect element.
     *  @param    {Element}   parent    The parent element to which the
     *                                  multiselect element will be added.
     *  @param    {object}    options   Optional parameters for the element that
     *                                  is added to the form.
     *    @property   {string}  name      Registration name of the input. This
     *                                    should uniquely identify the the.
     *    @property   {array}   options   An array of options to add to the
     *                                    multiselect element.
     *    @property   {string}  label     This is the label of the element that
     *                                    will be shown to the user.
     *    @property   {string}  tooltip   A short explanation about the input.
     */

    _createMultiSelect = (parent, options) => {
      // Create the multiselect element.
      this._container = new FormMultiSelect(parent, options);
    };
    /**
     *  Method for adding an option element to the select element.
     *  @param    {...any}    params       See FormSelect::addOption.
     *  @returns  {Element}
     */

    addOption = (...params) => {
      // Can't add options if we're not a select input.
      if (!this._container instanceof FormSelect) return; // Expose the option object.

      return this._container.addOption(...params);
    };
    /**
     *  Method for getting the current value of this element. Can be used as both
     *  a getter and a setter.
     *
     *  @getter
     *    @return   {string|undefined}
     *
     *  @setter
     *    @param    {string}      newValue    The new value for this element.
     *    @return   {FormInput}
     */

    value = newValue => {
      // If we are using a different object, we should relay to that.
      if (this._container instanceof FormSelect || this._container instanceof FormMultiSelect) {
        // If used as a getter, return the value of the select.
        if (newValue === undefined) return this._container.value(); // Set the requested value.

        this._container.value(newValue); // Allow chaining.


        return this;
      } // If used as a getter, return the value of the input.


      if (newValue === undefined) {
        // If this input was used as a file input, return the file.
        if (this._input.type == "file") return this._input.files[0]; // Otherwise, we can simply return the value.

        return this._input.value;
      } // Set the requested value.


      this._input.value = newValue; // Allow chaining.

      return this;
    };
    /**
     *  Method for disabling/enabling this element. Can be used as both a getter
     *  and a setter.
     *
     *  @getter
     *    @return   {boolean}
     *
     *  @setter
     *    @param    {boolean}     disable     Should this element be disabled?
     *    @return   {FormInput}
     */

    disabled = disable => {
      // If we are using a different object, we should relay to that.
      if (this._container instanceof FormSelect) {
        // If used as a getter, return the value of the select.
        if (disable === undefined) return this._container.disabled(); // Set the requested value.

        this._container.disabled(disable); // Allow chaining.


        return this;
      } // If used as a getter, return the disabled state of the input.


      if (disable === undefined) return this._input.disabled; // Set the requested attribute.

      this._input.disabled = disable; // Allow chaining.

      return this;
    };
  } // Export the FormInput class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Fieldset class that can be used to create fieldset
   *  elements for in a form.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class FormFieldset extends BaseElement {
    /**
     *  Reference to the legend element.
     *  @var      {Element}
     */
    _legend = null;
    /**
     *  Reference to the wrapper around the input elements.
     *  @var      {Element}
     */

    _inputContainer = null;
    /**
     *  Object that is used as a dictionary for keeping track of the inputs in the
     *  form.
     *  @var      {object}
     */

    _inputs = {};
    /**
     *  Object that is used as a dictionary for keeping track of the fieldsets in
     *  the form. Fieldsets can be used to group certain inputs together.
     *  @var      {object}
     */

    _fieldsets = {};
    /**
     *  Object that is used as a dictionary for keeping track of the buttons in
     *  the form.
     *  @var      {object}
     */

    _buttons = {};
    /**
     *  We need to be able to access the prefix is several methods.
     *  @var      {string}
     */

    _prefix = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element to which the fieldset
     *                                  will be added.
     *  @param    {object}    options   Optional parameters for the fieldset that
     *                                  is added to the form.
     *    @property   {string}  name      Registration name of the fieldset. This
     *                                    should uniquely identify the fieldset.
     *    @property   {string}  legend    This is the main label that is added to
     *                                    the fieldset.
     *    @property   {string}  tooltip   A short explanation about the input.
     *    @property   {array}   buttons   Optional array of buttons that are
     *                                    immediately added to the fieldset.
     *    @property   {array}   inputs    Optional array of inputs that are
     *                                    immediately added to the fieldset.
     */

    constructor(parent, options = {}) {
      // First call the constructor of the base class.
      super(); // Create a container for the input element.

      this._container = document.createElement("fieldset"); // Some browsers don't allow for certain styling on fieldsets. We can solve
      // this by wrapping the inputs in a div element.

      this._inputContainer = document.createElement("div");

      this._inputContainer.classList.add("fieldset-inputs");

      this._container.appendChild(this._inputContainer); // Create the legend element if a text is provided.


      if (options.legend) this.legend(options.legend); // Set the tooltip if provided.

      if (options.tooltip) this._container.setAttribute("title", options.tooltip); // We want to prefix the names of all inputs, fieldsets and buttons in this
      // fieldset with the fieldset's name because these names might not be unique
      // in the larger context of the form.

      this._prefix = options.name + '-'; // Add all provided buttons, fieldsets, and inputs to the form. We want to
      // make sure add the prefix.

      if (options.inputs) for (const input of options.inputs) this.addInput(input.name, input.options);
      if (options.fieldsets) for (const fieldset of options.fieldsets) this.addFieldset(fieldset.name, fieldset.options);
      if (options.buttons) for (const button of options.buttons) this.addButton(button.name, button.options); // Add the input element to the parent element.

      parent.appendChild(this._container);
    }
    /**
     *  Method for adding or updating the legend element.
     *  @param    {string}    newLabel  Optional string for the legend text. When
     *                                  no argument or an empty string is
     *                                  provided, the legend will be removed.
     *  @returns  {FormFieldset}
     */


    legend = newLabel => {
      // Do we already have a legend element?
      if (this._legend) {
        // Was a new label provided? Then we want to update the legend element.
        if (newLabel) this._legend.textContent = newLabel; // Was no new label provided? Then we can remove the legend element.
        else this._legend.remove(); // Is there no legend element yet?
      } else {
        // If a new label was provided, we should create the legend element.
        if (newLabel) {
          // Create the legend.
          this._legend = document.createElement("legend"); // Add the new label text.

          this._legend.textContent = newLabel; // Add the legend to the fieldset.

          this._container.prepend(this._legend);
        }
      } // Allow chaining.


      return this;
    };
    /**
     *  Method for adding an input element to the form.
     *  @param    {string}    unprefixed  Registration name of the input. This is
     *                                    also used in the API call and should
     *                                    uniquely identify the input.
     *  @param    {object}    options     Optional parameters for the element that
     *                                    is added to the form.
     *    @property   {string}  type        This is the type of input element.
     *                                      Default: 'text'
     *    @property   {string}  label       This is the label of the element that
     *                                      will be shown to the user.
     *  @returns  {FormInput}
     */

    addInput = (unprefixed, options = {}) => {
      // Add the prefix to the name.
      const name = this._prefix + unprefixed; // Create an input element.

      const input = new FormInput(this._inputContainer, Object.assign({}, options, {
        name
      })); // If there is already an input element with this name. If so, we need to
      // remove that first.

      if (this._inputs[name]) this._inputs[name].remove(); // Add the input element to the list of inputs.

      this._inputs[name] = input; // Expose the input object.

      return input;
    };
    /**
     *  Method for adding a fieldset element to the form.
     *  @param    {string}    unprefixed  Registration name of the fieldset. This
     *                                    should uniquely identify the fieldset.
     *  @param    {object}    options     Optional parameters for the fieldset
     *                                    that is added to the form.
     *    @property   {string}  legend      This is the main label that is added
     *                                      to the fieldset.
     *    @property   {array}   buttons     Optional array of buttons that are
     *                                      immediately added to the fieldset.
     *    @property   {array}   inputs      Optional array of inputs that are
     *                                      immediately added to the fieldset.
     *  @returns  {FormFieldset}
     */

    addFieldset = (unprefixed, options = {}) => {
      // Add the prefix to the name.
      const name = this._prefix + unprefixed; // Create a fieldset element. Also provide the name to the field set.

      const fieldset = new FormFieldset(this._inputContainer, Object.assign({}, options, {
        name
      })); // If there is already an fieldset element with this name. If so, we need to
      // remove that first.

      if (this._fieldsets[name]) this._fieldsets[name].remove(); // Add the fieldset element to the list of fieldsets.

      this._fieldsets[name] = fieldset; // Expose the fieldset object.

      return fieldset;
    };
    /**
     *  Method for adding a button to the form.
     *  @param    {string}    unprefixed  Registration name of the button.
     *  @param    {object}    options     Optional parameters for the element that
     *                                    is added to the form.
     *    @property   {string}  element     This is the name of the element that
     *                                      is added.
     *                                      Default: 'text'
     *    @property   {string}  label       This is the label of the element that
     *                                      will be shown to the user.
     *  @returns  {Button}
     */

    addButton = (unprefixed, options = {}) => {
      // Add the prefix to the name.
      const name = this._prefix + unprefixed; // Create an button element.

      const button = new Button(this._inputContainer, Object.assign({}, options, {
        name
      })); // If there is already an button element with this name. If so, we need to
      // remove that first.

      if (this._buttons[name]) this._buttons[name].remove(); // Add the button element to the list of buttons.

      this._buttons[name] = button; // Expose the button object.

      return button;
    };
    /**
     *  Method for setting the values of all input elements in this fieldset.
     *
     *  @getter
     *    @returns  {Object}
     *
     *  @setter
     *    @param    {Object}  newData  The new data to be used as inputs.
     *    @return   {Form}
     */

    values = newData => {
      // Is this used as a getter?
      if (newData === undefined) {
        // Start a new data object.
        const data = {}; // Add the data from all inputs to the data object.

        for (const [name, widget] of Object.entries(this._inputs)) data[name] = widget.value(); // Also add the data of all fieldsets to the data object.


        for (const [name, widget] of Object.entries(this._fieldsets)) {
          // Merge the data object with the fieldset data.
          Object.assign(data, widget.values());
        } // Return the entire data object.


        return data;
      } // Loop through all information we got to see if we should prefill an
      // input field.


      for (const [name, value] of Object.entries(newData)) {
        // See if there is an input with this name.
        const input = this._inputs[name]; // If so, set the correct value.

        if (input) input.value(value);
      } // Make sure that we also propagate this behaviour to other fieldsets.


      for (const fieldset of Object.values(this._fieldsets)) fieldset.values(newData); // Allow chaining.


      return this;
    };
    /**
     *  Method for disabling/enabling this element. Can be used as both a getter
     *  and a setter.
     *
     *  @getter
     *    @return   {boolean}
     *
     *  @setter
     *    @param    {boolean}     disable     Should this element be disabled?
     *    @return   {FormFieldset}
     */

    disabled = disable => {
      // If used as a getter, return the disabled state of the input.
      if (disable === undefined) return this._container.disabled; // Set the requested attribute.

      this._container.disabled = disable; // Allow chaining.

      return this;
    };
    /**
     *  We need to append the remove method to clean up other elements we've
     *  added. We have to use non-arrow function or we'd lose the super context.
     */

    remove() {
      // Remove all DOM elements we've added.
      if (this._legend) this._legend.remove(); // Remove all classes we've added.

      if (this._inputs) for (const input of Object.values(this._inputs)) input.remove();
      if (this._fieldsets) for (const fieldset of Object.values(this._fieldsets)) fieldset.remove();
      if (this._buttons) for (const button of Object.values(this._buttons)) button.remove(); // Call the original remove method. This also removes the container.

      super.remove();
    }

  } // Export the FormFieldset class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Title class that can be used to add a title to another
   *  element.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Title extends BaseElement {
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element to which the input
     *                                  element will be added.
     *  @param    {object}    options
     *    @property   {string}  type    Optional parameter for changing the header
     *                                  type.
     *    @property   {string}  title   Optional title text to install. This can
     *                                  also be after the fact with the update
     *                                  method.
     */
    constructor(parent, options) {
      // First call the constructor of the base class.
      super(); // Create a container for the title element.

      this._container = document.createElement(options.type || "h1"); // Use the label for the on hover title.

      if (options.title) this._container.textContent = options.title; // Add the title element to the parent element.

      parent.appendChild(this._container);
    }
    /**
     *  Method for updating the title text.
     *  @param    {string}    update    The new title text.
     *  @returns  {Title}
     */


    update = update => {
      // Simply insert the new text.
      this._container.textContent = update; // Allow chaining;

      return this;
    };
  } // Export the Title class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the ErrorDisplay class that can be used to show error
   *  messages.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class ErrorDisplay extends BaseElement {
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element to which the button
     *                                  element will be added.
     */
    constructor(parent) {
      // First call the constructor of the base class.
      super(); // Create a container for the button element.

      this._container = document.createElement("div");

      this._container.classList.add("error-display"); // Add the button element to the parent element.


      parent.appendChild(this._container);
    }
    /**
     *  Method to add an error to the bus.
     *  @param    {string}        error     Error message that is to be displayed.
     *  @returns  {ErrorDisplay}
     */


    add = error => {
      // We don't know how to deal with anything other than strings at this point.
      if (typeof error != "string") return; // Create a paragraph.

      const p = document.createElement("p"); // Install the error text.

      p.textContent = "Error: " + error; // Add the error to the display.

      this._container.appendChild(p); // Allow chaining.


      return this;
    };
    /**
     *  Removes all errors and resets the display.
     *  @returns  {ErrorDisplay}
     */

    clear = () => {
      // Remove all child nodes from the container.
      while (this._container.firstChild) this._container.firstChild.remove(); // Allow chaining.


      return this;
    };
    /**
     *  Method to remove this object and clean up after itself.
     */

    remove = () => {
      // Then let the parent element clean up the container.
      super.remove();
    };
  } // Export the ErrorDisplay class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Form class that can be used to create a form element.
   *
   *  @event      submit        Triggered when the user opts to submit the form.
   *                            Will contain a FormData object with the submitted
   *                            data from the form.
   *  @event      stored        Triggered when the API call has succeeded. Will
   *                            contain the server response data.
   *  @event      error         Triggered when the API call has failed. Will
   *                            contain the server response data.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Form extends BaseElement {
    /**
     *  Private variable that stores a reference to the Title element if a
     *  title was added to the form.
     *  @var      {Title}
     */
    _title = null;
    /**
     *  Element that displays error messages.
     *  @var      {ErrorDisplay}
     */

    _errorDisplay = null;
    /**
     *  Object that is used as a dictionary for keeping track of the inputs in the
     *  form.
     *  @var      {object}
     */

    _inputs = {};
    /**
     *  Object that is used as a dictionary for keeping track of the fieldsets in
     *  the form. Fieldsets can be used to group certain inputs together.
     *  @var      {object}
     */

    _fieldsets = {};
    /**
     *  Object that is used as a dictionary for keeping track of the buttons in
     *  the form.
     *  @var      {object}
     */

    _buttons = {};
    /**
     *  Reference to the parameters we'll need for the API call.
     *  @var      {object}
     */

    _params = null;
    /**
     *  Reference to the request object.
     *  @var      {Request}
     */

    _request = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      The parent element to which the form
     *                                    will be added.
     *  @param    {object}    options     Optional parameters for instantiating
     *                                    the form.
     *    @property   {array}   buttons     Optional array of buttons that are
     *                                      immediately added to the form.
     *    @property   {array}   inputs      Optional array of inputs that are
     *                                      immediately added to the form.
     *    @property   {string}  title       Optional string for a title to add to
     *                                      the form.
     *    @property   {boolean} center      Should this form be centered in the
     *                                      parent element?
     *                                      Default: false.
     *    @property   {object}    params    Optional parameters for submitting the
     *                                      form and performing the API call. This
     *                                      object can contain 'get', 'post', or
     *                                      'put' objects with the parameters of
     *                                      API calls. If the 'get' object is
     *                                      provided, the 'post' object will be
     *                                      ignored.
     *     @property     {string}  get        An string containing the API
     *                                        endpoint used for getting the
     *                                        information to prefill the form.
     *     @property     {string}  put        An string containing the API
     *                                        endpoint used for submitting the
     *                                        form when editing an entity.
     *     @property     {string}  post       An string containing the API
     *                                        endpoint used for submitting the
     *                                        form when creating a new entity.
     */

    constructor(parent, options = {}, params) {
      // Call the parent class's constructor.
      super(); // Create a container for the form.

      this._container = document.createElement("form"); // Create a new request object.

      this._request = new Request(); // Store the API parameters.

      if (options.params) this._params = options.params; // Make sure we listen to submit events.

      this._container.addEventListener('submit', this.submit); // Add the title if requested.


      if (options.title) this.title(options.title); // Add an ErrorDisplay under the main title.

      this._errorDisplay = new ErrorDisplay(this._container); // Add the center class to the form if requested.

      if (options.center) this._container.classList.add("center"); // Add all provided buttons and inputs to the form.

      if (options.inputs) for (const input of options.inputs) this.addInput(input.name, input.options);
      if (options.fieldsets) for (const fieldset of options.fieldsets) this.addFieldset(fieldset.name, fieldset.options);
      if (options.buttons) for (const button of options.buttons) this.addButton(button.name, button.options); // If we got a GET parameter, we can try to prefill data in this form.

      if (options.params && options.params.get) this._request.get(options.params.get).then(this._prefill).catch(error => this.showError(error)); // Add the form to the parent element.

      parent.appendChild(this._container);
    }
    /**
     *  Method for adding or update the title.
     *  @param    {string}    newTitle  Optional string for the title text. When
     *                                  no argument or an empty string is
     *                                  provided, the title will be removed.
     *  @returns  {Form}
     */


    title = newTitle => {
      // Do we already have a title component?
      if (this._title) {
        // Was a new title provided? Then we want to update the title component.
        if (newTitle) this._title.update(newTitle); // Was no new title provided? Then we can remove the title component.
        else this._title.remove(); // Is there no title component yet?
      } else {
        // If a new title was provided, we should create the title component.
        if (newTitle) this._title = new Title(this._container, {
          title: newTitle
        });
      } // Allow chaining.


      return this;
    };
    /**
     *  Method for adding an input element to the form.
     *  @param    {string}    name      Registration name of the input. This is
     *                                  also used in the API call and should
     *                                  uniquely identify the input.
     *  @param    {object}    options   Optional parameters for the element that
     *                                  is added to the form.
     *    @property   {string}  type      This is the type of input element.
     *    @property   {string}  label     This is the label of the element that
     *                                    will be shown to the user.
     *    @property   {string}  tooltip   A short explanation about the input.
     *  @returns  {FormInput}
     */

    addInput = (name, options = {}) => {
      // Create an input element.
      const input = new FormInput(this._container, Object.assign({}, options, {
        name
      })); // If there is already an input element with this name. If so, we need to
      // remove that first.

      if (this._inputs[name]) this._inputs[name].remove(); // Add the input element to the list of inputs.

      this._inputs[name] = input; // Expose the input object.

      return input;
    };
    /**
     *  Method for adding a fieldset element to the form.
     *  @param    {string}    name      Registration name of the fieldset. This
     *                                  should uniquely identify the fieldset.
     *  @param    {object}    options   Optional parameters for the fieldset that
     *                                  is added to the form.
     *    @property   {string}  legend    This is the main label that is added to
     *                                    the fieldset.
     *    @property   {array}   buttons   Optional array of buttons that are
     *                                    immediately added to the fieldset.
     *    @property   {array}   inputs    Optional array of inputs that are
     *                                    immediately added to the fieldset.
     *    @property   {string}  tooltip   A short explanation about the input.
     *  @returns  {FormFieldset}
     */

    addFieldset = (name, options = {}) => {
      // Create a fieldset element. Also provide the name to the fieldset.
      const fieldset = new FormFieldset(this._container, Object.assign({}, options, {
        name
      })); // If there is already an fieldset element with this name. If so, we need to
      // remove that first.

      if (this._fieldsets[name]) this._fieldsets[name].remove(); // Add the fieldset element to the list of fieldsets.

      this._fieldsets[name] = fieldset; // Expose the fieldset object.

      return fieldset;
    };
    /**
     *  Method for adding a button to the form.
     *  @param    {string}    name      Registration name of the button.
     *  @param    {object}    options   Optional parameters for the element that
     *                                  is added to the form.
     *    @property   {string}  type      This is the type of input element.
     *    @property   {string}  label     This is the label of the element that
     *                                    will be shown to the user.
     *  @returns  {Button}
     */

    addButton = (name, options = {}) => {
      // Create an button element.
      const button = new Button(this._container, Object.assign({}, options, {
        name
      })); // If there is already an button element with this name. If so, we need to
      // remove that first.

      if (this._buttons[name]) this._buttons[name].remove(); // Add the button element to the list of buttons.

      this._buttons[name] = button; // Expose the button object.

      return button;
    };
    /**
     *  Method to submit the form.
     *  @param    {Event}     event     Optional parameter that is supplied if
     *                                  this method is used as a callback for an
     *                                  event listener.
     *  @returns  {Promise|undefined}
     */

    submit = event => {
      // We don't ever want to reload a page to submit a form. So we prevent the
      // default submit behaviour here if this method was called an part of an
      // event listener.
      if (event) event.preventDefault(); // Get the values from the form.

      const values = this.values(); // Trigger the submit event and provide the submitted values.

      this.trigger('submit', values); // We cannot perform any HTTP requests without parameters.

      if (!this._params) return; // If we have the parameters for a PUT request, perform the PUT request.

      if (this._params.put) return this._request.put(this._params.put, values).then(this._submitResponseHandler).catch(error => this.showError(error)); // If we don't have the parameters for a PUT request, but we do have the
      // parameters for a POST request, perform the POST request.

      if (this._params.post) return this._request.post(this._params.post, values).then(this._submitResponseHandler).catch(error => this.showError(error));
    };
    /**
     *  Private method for handling an HTTP submit request response.
     *  @param    {Response}  reponse Reponse object from an HTTP request.
     */

    _submitResponseHandler = response => {
      // Get access to the JSON object.
      response.json().then(json => {
        // Use the form's error handling if an error has occurred with the HTTP
        // request.
        if (!response.ok) return this.showError(json.error); // Otherwise, we can trigger the 'stored' event.

        this.trigger("stored", json);
      });
    };
    /**
     *  Method for showing errors.
     *  @param    {string|Error}      error   Error message.
     *  @returns  {Form}
     */

    showError = error => {
      // If this is an Error object, we should extract the error message first.
      const message = error instanceof Error ? error.message : error; // Clear the error display to show the new error.

      this._errorDisplay.clear().add(message); // Allow chaining.


      return this;
    };
    /**
     *  Private method for prefilling form fields with an HTTP request response.
     *  @param    {Response}  reponse Reponse object from an HTTP request.
     */

    _prefill = response => {
      // Get access to the JSON object.
      response.json().then(json => {
        // Use the form's error handling if an error has occurred with the HTTP
        // request.
        if (!response.ok) return this.showError(json.error); // Prefill all data.

        this.values(json);
      });
    };
    /**
     *  Method for getting or setting the values of all input elements in this
     *  form.
     *
     *  @getter
     *    @returns  {object}
     *
     *  @setter
     *    @param    {object}  newData  The new data to be used as inputs.
     *    @returns  {Form}
     */

    values = newData => {
      // Is this used as a getter?
      if (newData === undefined) {
        // Start a new data object.
        const data = {}; // Add the data from all inputs to the data object.

        for (const [name, widget] of Object.entries(this._inputs)) data[name] = widget.value(); // Also add the data of all fieldsets to the data object.


        for (const [name, widget] of Object.entries(this._fieldsets)) {
          // Merge the data object with the fieldset data.
          Object.assign(data, widget.values());
        } // Return the entire data object.


        return data;
      } // Loop through all information we got to see if we should prefill an
      // input field.


      for (const [name, value] of Object.entries(newData)) {
        // See if there is an input with this name.
        const input = this._inputs[name]; // If so, set the correct value.

        if (input) input.value(value);
      } // Make sure that we also propagate this behaviour to fieldsets.


      for (const fieldset of Object.values(this._fieldsets)) fieldset.values(newData); // Allow chaining.


      return this;
    };
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */

    remove() {
      // Remove class objects we created.
      if (this._title) this._title.remove();
      if (this._inputs) for (const input of Object.values(this._inputs)) input.remove();
      if (this._fieldsets) for (const fieldset of Object.values(this._fieldsets)) fieldset.remove();
      if (this._buttons) for (const button of Object.values(this._buttons)) button.remove();
      if (this._request) this._request.remove(); // Remove all references.

      this._title = null;
      this._inputs = {};
      this._fieldsets = {};
      this._buttons = {}; // Call the remove function for the base class. This will also remove the
      // container.

      super.remove();
    }

  } // Export the Form class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Login class component that can be used to load a login
   *  form.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Login extends BaseElement {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  Private variable that stores a reference to the Form element.
     *  @var      {Form}
     */

    _form = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      Container to which this component will
     *                                    be added.
     *  @param    {array}     options
     */

    constructor(parent, options = {}) {
      // Call the base class constructor first.
      super(); // Create a container for this component.

      this._container = document.createElement("div");

      this._container.classList.add("login", "component"); // Determine the form's title.


      const title = "Login"; // Use the form's title as the page title.

      this.pageTitle(title); // Create a login form.

      this._form = new Form(this._container, {
        title,
        center: true,
        params: {
          post: '/login'
        },
        inputs: [{
          name: "email",
          options: {
            label: "Email address",
            type: "email",
            required: true
          }
        }, {
          name: "password",
          options: {
            label: "Password",
            type: "password",
            required: true
          }
        }],
        buttons: [{
          name: "submit",
          options: {
            label: "Login",
            type: "submit"
          }
        }]
      }); // Listen for when the registration was successful.

      this._form.on("stored", response => {
        // Move to the list of apps after login.
        goTo("/admin/apps");
      }); // Create a new link for navigating the register page.


      const link = document.createElement('a');
      link.addEventListener('click', () => void goTo('/register'));
      link.textContent = "No account? Register one here."; // Add the link to a new paragraph and add that paragraph to the container.

      const paragraph = document.createElement('p');
      paragraph.appendChild(link);

      this._container.appendChild(paragraph); // Add the new element to the parent container.


      parent.appendChild(this._container);
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Remove the Form element.
      this._form.remove(); // Call the BaseElement's remove function.


      super.remove();
    }

  } // Export the Login class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Logout class component that can be used to log out.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Logout extends BaseElement {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  Private variable that stores the reference to the Request object.
     *  @var      {Request}
     */

    _request = null;
    /**
     *  Private variable that stores the reference to the Apology object.
     *  @var      {Apology}
     */

    _apology = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      Container to which this component will
     *                                    be added.
     */

    constructor(parent) {
      // Call the base class constructor first.
      super(); // Create a container for this component.

      this._container = document.createElement("div"); // Determine the component's title.

      const title = "Logging out."; // Use the component's title as the page title.

      this.pageTitle(title); // Show a brief message that we're logging out.

      this._apology = new Apology(this._container, title); // We need to make an API call to log off so we need the Request object.

      this._request = new Request();

      this._request.get('/logout').catch(error => void this._apology.update("Error occurred: could not log out.")).then(response => {
        // If we get no response, something weird happened and we could not log
        // out.
        if (!response) return this._apology.update("Error occurred: could not log out."); // Move to the login page. Here we don't want to use our usual `goTo`
        // function as the `goTo` function prevents full page reloads. Since we
        // just logged out, we want a full page reload to clean up client-side
        // caching so that all artifacts from any previous sessions disappear.

        window.location.href = "/login";
      }); // Add the new element to the parent container.


      parent.appendChild(this._container);
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Remove the Form element.
      this._form.remove(); // Call the BaseElement's remove function.


      super.remove();
    }

  } // Export the Logout class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Registration class component that can be used to load
   *  a registration form.
   *
   *  @event      navigate      Triggered when the this component has finished.
   *                            May contain a suggestion for the component to load
   *                            next.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Registration extends BaseElement {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  Private variable that stores a reference to the Form element.
     *  @var      {Form}
     */

    _form = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      Container to which this component will
     *                                    be added.
     *  @param    {array}     options
     */

    constructor(parent, options = {}) {
      // Call the base class constructor first.
      super(); // Create a container for this component.

      this._container = document.createElement("div");

      this._container.classList.add("registration", "component"); // Determine the form's title.


      const title = "Registration"; // Use the form's title as the page title.

      this.pageTitle(title); // Create a registration form.

      this._form = new Form(this._container, {
        title,
        center: true,
        params: {
          post: '/user'
        },
        inputs: [{
          name: "email",
          options: {
            label: "Email address",
            type: "email",
            required: true
          }
        }, {
          name: "password",
          options: {
            label: "Password",
            type: "password",
            required: true
          }
        }, {
          name: "repeat",
          options: {
            label: "Repeat password",
            type: "password",
            required: true
          }
        }],
        buttons: [{
          name: "submit",
          options: {
            label: "Register",
            type: "submit"
          }
        }]
      }); // Go to the login page after a successful registration.

      this._form.on("stored", () => void goTo('/login')); // Create a new link for navigating the login page.


      const link = document.createElement('a');
      link.addEventListener('click', () => void goTo('/login'));
      link.textContent = "Already an account? Login here."; // Add the link to a new paragraph and add that paragraph to the container.

      const paragraph = document.createElement('p');
      paragraph.appendChild(link);

      this._container.appendChild(paragraph); // Add the new element to the parent container.


      parent.appendChild(this._container);
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Remove the Form element.
      this._form.remove(); // Call the BaseElement's remove function.


      super.remove();
    }

  } // Export the Registration class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the PasswordForm class component that can be used to load
   *  a form to change a password.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class PasswordForm extends BaseElement {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  Private variable that stores a reference to the Form element.
     *  @var      {Form}
     */

    _form = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      Container to which this component will
     *                                    be added.
     */

    constructor(parent) {
      // Call the base class constructor first.
      super(); // Create a container for this component.

      this._container = document.createElement("div");

      this._container.classList.add("passwordform", "component"); // Determine the form's title.


      const title = "Change password"; // Use the form's title as the page title.

      this.pageTitle(title); // Create a change password.

      this._form = new Form(this._container, {
        title,
        center: true,
        params: {
          post: "/user/password"
        },
        inputs: [{
          name: "password",
          options: {
            label: "Password",
            type: "password"
          }
        }, {
          name: "repeat",
          options: {
            label: "Repeat password",
            type: "password"
          }
        }],
        buttons: [{
          name: "submit",
          options: {
            label: "Change",
            type: "submit"
          }
        }]
      }); // Go to the app list after a successful password change.

      this._form.on("stored", () => void goTo('/admin/apps')); // Add the new element to the parent container.


      parent.appendChild(this._container);
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Remove the Form element.
      this._form.remove(); // Call the BaseElement's remove function.


      super.remove();
    }

  } // Export the PasswordForm class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Overlay class that can be used to create an overlay
   *  interface for a full screen video format. It can be used to any number of
   *  HTML elements to an overlay layout that is divided in a 'top' and 'bottom'
   *  part.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Overlay extends BaseElement {
    /**
     *  Private variable that stores a reference to the container positioned at
     *  the top of the overlay.
     *  @var      {Element}
     */
    _top = null;
    /**
     *  Private variable that stores a reference to the container positioned at
     *  the bottom of the overlay.
     *  @var      {Element}
     */

    _bottom = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element on which the
     *                                  overlay interface will be installed.
     */

    constructor(parent) {
      // Call the base class constructor.
      super(); // Create a container for the overlay.

      this._container = document.createElement("div");

      this._container.classList.add("overlay"); // Create a container for the top elements.


      this._top = document.createElement("section");

      this._top.classList.add("overlay-top");

      this._container.appendChild(this._top); // Create a container for the bottom elements.


      this._bottom = document.createElement("section");

      this._bottom.classList.add("overlay-bottom");

      this._container.appendChild(this._bottom); // Add the overlay to the parent container.


      parent.appendChild(this._container);
    }
    /**
     *  Method for adding an element to the overlay.
     *  @param    {string}    type      What kind of element should this be? All
     *                                  valid HTML elements are accepted.
     *  @param    {object}    options   Object with options to initialize the
     *                                  element.
     *    @property {string}    text      Text to use in the element. Elements
     *                                    have no text by default.
     *    @property {string}    location  Where should this element be added?
     *                                    Valid options are 'top' and 'bottom'.
     *                                    'bottom' is the default option.
     *    @property {boolean}   animated  Should this element be animated when it
     *                                    is emptied or text is added?
     *  @returns  {Element}
     */


    add = (type, options = {}) => {
      // Create the new DOM element.
      const element = document.createElement(type); // If text was provided, we should add it to the element.

      if (options.text) element.textContent = options.text; // If it should be animated, add the animated class.

      if (options.animated) element.classList.add('animated'); // If the 'top' location was specified, we should add this element to the
      // top of the overlay.

      if (options.location == 'top') this._top.appendChild(element); // Otherwise, we'll add the element to the bottom of the overlay.
      else this._bottom.appendChild(element); // Finally, return the element.

      return element;
    };
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */

    remove() {
      // Remove all additional references to DOM elements we've stored.
      this._top.remove();

      this._bottom.remove(); // Call the original remove method.


      super.remove();
    }

  } // Export the Overlay class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the BarcodeScanner class that can be used to scan barcodes
   *  from the device camera.
   *
   *  @event      scanned       Triggered when a detected barcode could be read.
   *                            Provides the barcode's product number.
   *  @event      error         Triggered when an unrecoverable error has
   *                            occurred.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class BarcodeScanner extends BaseElement {
    /**
     *  Private variable that stores a reference to the overlay object.
     *  @var      {Overlay}
     */
    _overlay = null;
    /**
     *  Private variable that keeps track of the Quagga settings.
     *  @var      {object}    state     A state object to initialize Quagga.
     *    @property {object}    inputStream
     *    @property {object}    locator
     *    @property {integer}   numOfWorkers
     *    @property {integer}   frequency
     *    @property {object}    decoder
     *    @property {boolean}   locate
     */

    _state = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element on which the
     *                                  barcode scanner interface will be
     *                                  installed.
     */

    constructor(parent) {
      // Call the base class constructor.
      super(); // Initialize the interface for the barcode scanner. It should return a
      // container for the video element that Quagga creates.

      const videoContainer = this._initInterface(parent); // Store the Quagga state.


      this._state = {
        inputStream: {
          // We need the video stream for this class.
          type: "LiveStream",
          // A low resolution should work well enough. This should help
          // performance while a higher resolution might help detection.
          constraints: {
            width: {
              min: 1280
            },
            height: {
              min: 720
            },
            facingMode: "environment",
            aspectRatio: {
              min: 1,
              max: 2
            }
          },
          // Pass the container for the video element in the DOM.
          target: videoContainer
        },
        // Increasing workers might help performance on devices that have suffient
        // cores. We assume that this device will be used on mobile devices
        // mostly, so we don't assume multiple cores.
        numOfWorkers: 0,
        frequency: 10,
        // We want to be able to read all possible barcodes. This will likely
        // cause a performance hit and lead to an increase in false positives,
        // but we should be able to handle that quite well.
        decoder: {
          readers: [// These are the most used barcode formats for customer products:
          {
            format: "ean_reader",
            config: {}
          }, {
            format: "ean_8_reader",
            config: {}
          }, {
            format: "upc_reader",
            config: {}
          }, {
            format: "upc_e_reader",
            config: {}
          }, {
            format: "code_93_reader",
            config: {}
          } // Optionally, we could expand to also use the following formats:
          // { format: "code_39_reader", config: {} },
          // { format: "code_39_vin_reader", config: {} },
          // { format: "code_128_reader", config: {} },
          // { format: "codabar_reader", config: {} },
          // { format: "i2of5_reader", config: {} },
          // { format: "2of5_reader", config: {} },
          ],
          // We don't need to detect multiple barcodes simultaneously.
          multiple: false
        },
        // We want to detect barcodes even if they do not align perfectly with the
        // frame of the camera.
        locate: true,
        // Increasing these settings will help detection, but not as much as
        // increasing the resolution. It is better for performance to keep these
        // low if our accuracy is sufficient.
        locator: {
          patchSize: "medium",
          halfSample: true
        }
      }; // Initialize Quagga.

      this._initQuagga();
    }
    /**
     *  Private method for initializing Quagga.
     *  @param    {object}    state     A state object to initialize Quagga.
     *    @property {object}    inputStream
     *    @property {object}    locator
     *    @property {integer}   numOfWorkers
     *    @property {integer}   frequency
     *    @property {object}    decoder
     *    @property {boolean}   locate
     */


    _initQuagga = () => {
      // Initialize the barcode scanner.
      this.start(); // Handle cases when Quagga has read a barcode.

      Quagga.onDetected(result => {
        // Get the barcode that was read.
        const code = result.codeResult.code; // Trigger the event immediately.

        this.trigger('scanned', {
          code
        });
      });
    };
    /**
     *  Private method for initializing the DOM interface.
     *  @param    {Element}   parent    The parent element on which the
     *                                  barcode scanner interface will be
     *                                  installed.
     *  @returns  {Element}   The container for the video element.
     */

    _initInterface = parent => {
      // Create a container for the barcode scanner.
      this._container = document.createElement("div"); // Add the styling class to the container element.

      this._container.classList.add("barcodescanner"); // Create a container for the video element.


      const video = document.createElement("div"); // Add the styling class to the container element.

      video.classList.add("barcodescanner-video"); // Append the video container to the overall container.

      this._container.appendChild(video); // Create the overlay in this container.


      this._initOverlay(this._container); // Add the entire interface to the parent container.


      parent.appendChild(this._container); // Return the container for the video element.

      return video;
    };
    /**
     *  Private method for creating an overlay for the interface.
     *  @param    {Element}   parent    The parent element on which the overlay
     *                                  interface will be installed.
     */

    _initOverlay = parent => {
      // Create a container for the overlay element.
      const container = document.createElement("div"); // Add the styling class to the container element.

      container.classList.add("barcodescanner-overlay"); // Create an overlay object.

      this._overlay = new Overlay(container); // Add the overlay container to the parent container.

      parent.appendChild(container);
    };
    /**
     *  Private method for handling errors.
     *  @param    {string}    error     A string describing the error that has
     *                                  occurred.
     */

    _handleError = error => void this.trigger("error", error);
    /**
     *  Method to expose the Overlay object.
     *  @returns  {Overlay}
     */

    overlay = () => {
      // Expose the overlay element.
      return this._overlay;
    };
    /**
     *  Method to start scanning.
     *  @var      {object}    state     A state object to initialize Quagga.
     *    @property {object}    inputStream
     *    @property {object}    locator
     *    @property {integer}   numOfWorkers
     *    @property {integer}   frequency
     *    @property {object}    decoder
     *    @property {boolean}   locate
     *  @returns  {BarcodeScanner}
     */

    start = (state = this._state) => {
      // Initialize the Quagga object.
      Quagga.init(state, error => {
        // Handle errors with our own error handler.
        if (error) return this._handleError(error); // Start Quagga so that we start processing the video feed.

        Quagga.start();
      }); // Allow chaining.

      return this;
    };
    /**
     *  Method to stop scanning.
     *  @returns  {BarcodeScanner}
     */

    stop = () => {
      // Stop Quagga so that we stop processing the video feed.
      Quagga.stop(); // Allow chaining.

      return this;
    };
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */

    remove() {
      // Make sure we stop scanning first.
      this.stop(); // Delete the state.

      delete this._state; // Remove class objects we used.

      this._overlay.remove(); // Call the original remove function.


      super.remove();
    }

  } // Export the BarcodeScanner class so it can be imported elsewhere.

  /**
   *  The definition of the HitTest class that can be used to perform a WebXR hit
   *  test.
   *
   *  This class is based on an example by Ada Rose Cannon.
   *  Source: https://medium.com/samsung-internet-dev/making-an-ar-game-with-aframe-529e03ae90cb
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */
  class HitTest {
    /**
     *  Private variable that stores the renderer.
     *  @var      {WebGLRenderer}
     */
    _renderer = null;
    /**
     *  Private variable that stores the XRHitTestSource.
     *  @var      {XRHitTestSource}
     */

    _hitTestSource = null;
    /**
     *  Private variable that stores the WebXR session.
     *  @var      {XRSession}
     */

    _session = null;
    /**
     *  Private variable that stores the options object.
     *  @var      {object}
     *    @property   {string}      profile   String describing the input profile.
     *    @property   {XRSpace}     space     WebXR reference space object for the
     *                                        target ray space.
     */

    _options = null;
    /**
     *  Class constructor.
     *  @param    {WebGLRenderer} renderer  The renderer from a WebXR session.
     *  @param    {object}        options   Optional option parameters.
     *    @property   {string}      profile   String describing the input profile.
     *    @property   {XRSpace}     space     WebXR reference space object for the
     *                                        target ray space.
     */

    constructor(renderer, options) {
      // Store the XR renderer.
      this._renderer = renderer; // Store the options.

      this._options = options; // Make sure we reset the hit test source every time the session ends.

      this._renderer.xr.addEventListener("sessionend", () => this._resetHitTestSource()); // Make sure we start whenever the session starts.


      this._renderer.xr.addEventListener("sessionstart", () => this._onSessionStart()); // If the WebXR session has already started, we should immediately start the
      // hit test session.


      if (this._renderer.xr.isPresenting) this._onSessionStart();
    }
    /**
     *  Event listener for when the WebXR session ends. It simply resets the hit
     *  test source.
     */


    _resetHitTestSource = () => {
      // Simply set it back to null.
      this._hitTestSource = null;
    };
    /**
     *  Event listener for when the WebXR session starts.
     *  @returns  {XRHitTestSource}
     */

    _onSessionStart = async () => {
      // Store the current WebXR session.
      this._session = this._renderer.xr.getSession(); // If we have a ray space, use that to get the source for the hit test.

      if (this._options.space) return this._hitTestSource = await this._session.requestHitTestSource(this._options); // If we are dealing with transient input, use that to get the source for
      // the hit test.

      if (this._options.profile) return this._hitTestSource = await this._session.requestHitTestSourceForTransientInput(this._options);
    };
    /**
     *  Method to do a hit test for a single frame.
     *  @param    {XRFrame}       frame   The frame that the hit test will be done
     *                                    for.
     *  @returns  {object | false}        An object describing the input space and
     *                                    the pose of the hit location. Or false
     *                                    if the hit test was unsuccessful.
     */

    doHit = frame => {
      // If we're not in an active session, we cannot do a hit test.
      if (!this._renderer.xr.isPresenting) return; // Get a reference space for this WebXR session.

      const referenceSpace = this._renderer.xr.getReferenceSpace(); // We need both a source for the hit test and there should be a viewer pose,
      // otherwise we cannot do a hit test.


      if (!(this._hitTestSource && frame.getViewerPose(referenceSpace))) return; // If we have a profile, we'll need to do a transient hit test.

      if (this._options.profile) return this._transientHitTest(frame, referenceSpace); // Otherwise, we can do a normal hit test.

      return this._hitTest(frame, referenceSpace);
    };
    /**
     *  Private method to do a normal hit test.
     *  @param {XRFrame}          frame           The frame for the hit test.
     *  @param {XRReferenceSpace} referenceSpace  Coordinate system.
     *  @returns  {object | false}                An object describing the input
     *                                            space and the pose of the hit
     *                                            location. Or false if the hit
     *                                            test was unsuccessful.
     */

    _hitTest = (frame, referenceSpace) => {
      // Get the hit test results for this frame.
      const results = frame.getHitTestResults(this._hitTestSource); // If we didn't get any results, we should return false.

      if (!results.length) return false; // Get the pose of the first result of the hit test. This should be the one
      // closest to the viewer and thus most likely to be the most relevant one.

      const pose = results[0].getPose(referenceSpace); // The hit test was succesful, so we can return the pose of the most
      // relevant hit test result and we can use the target ray space that was
      // provided  with the options.

      return {
        pose,
        inputSpace: this._options.space
      };
    };
    /**
     *  Private method to do a hit test for a transient input.
     *  @param {XRFrame}          frame           The frame for the hit test.
     *  @param {XRReferenceSpace} referenceSpace  Coordinate system.
     *  @returns  {object | false}                An object describing the input
     *                                            space and the pose of the hit
     *                                            location. Or false if the hit
     *                                            test was unsuccessful.
     */

    _transientHitTest = (frame, referenceSpace) => {
      // Get the transient input hit test results for this frame.
      const results = frame.getHitTestResultsForTransientInput(this._hitTestSource); // If we didn't get any results, we should return false.

      if (!results.length) return false; // Get the first result of the hit test. It should be the one closest to the
      // viewer and thus most likely the most relevant one.

      const closest = results[0]; // If the closest result is empty, we have nothing to process.

      if (!closest.length) return false; // Get the pose for the closest result.

      const pose = closest[0].getPose(referenceSpace); // The hit test was succesful, so we can return the pose of the most
      // relevant hit test result and we can use the target ray that came with the
      // test.

      return {
        pose,
        inputSpace: results[0].inputSource.targetRaySpace
      };
    };
    /**
     *  Method to remove this object and clean up after itself.
     */

    remove = () => {// This class does not have any elements in the DOM, does not use any other
      // custom classes, or uses any event handlers that need to be removed, but
      // we want this method here for consistency's sake.
    };
  } // Export the HitTest class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Reticle class that can be used to create a reticle
   *  element in an Aframe scene that can be used to detect surfaces.
   *
   *  @event      success       Triggered when hit tests start succeeding.
   *  @event      fail          Triggered when hit tests start failing.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Reticle extends BaseElement {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  Private variable that stores a cache for the hit test.
     */

    _cache = new Map();
    /**
     *  Private variable that keeps track of whether the latest hit test was a
     *  success.
     *  @var      {boolean}
     */

    _latestSuccess = false;
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element to which the reticle
     *                                  will be added.
     */

    constructor(parent) {
      // Call the BaseElement constructor.
      super(); // First, register the Aframe primitive so that we can use the <a-reticle>
      // element in the DOM.

      this._registerPrimitive('ar-hit-test'); // Create an Aframe reticle element. This is the functional element that
      // will be doing the hit tests so that it can detect surfaces.


      this._container = document.createElement("a-reticle");

      this._container.classList.add("arscene-reticle"); // We don't need to start hit testing right away and the reticle should be
      // hidden by default.


      this._container.setAttribute("testing", "false");

      this._container.setAttribute("visible", "false"); // Start at the origin.


      this._container.setAttribute("position", "0 0 0");

      this._container.setAttribute("rotation", "0 0 0"); // Create an Aframe plane element that will be the visible part of the
      // reticle. It will server as a hit marker.


      const marker = document.createElement("a-plane"); // We need the marker to be flat on the ground, so we rotate by 90 degrees.

      marker.setAttribute("rotation", "-90 0 0"); // We need to give it some modest dimensions. The reticle should be easy to
      // spot and use, but should not hide the environment.

      marker.setAttribute("width", "0.2");
      marker.setAttribute("height", "0.2"); // Determine what the reticle looks like.

      marker.setAttribute("src", "/images/arrowTransparent.png");
      marker.setAttribute("material", "transparent:true;"); // Add the marker to the reticle.

      this._container.appendChild(marker); // Add the reticle to the parent element.


      parent.appendChild(this._container);
    }
    /**
     *  Private method to register the a-reticle primitive element with AFRAME so
     *  that we can use that element in within the a-scene container in the DOM.
     *  @param    {string}    name    Name of the AR hit test component.
     */


    _registerPrimitive = name => {
      // First register the hit test component that we need for this primitive.
      this._registerComponent(name); // Then register the primitive element so that we can use the <a-reticle>
      // element in the DOM within the <a-scene> element.


      if (!AFRAME.primitives.primitives['a-reticle']) AFRAME.registerPrimitive('a-reticle', {
        /**
         *  These are the preset default components. Here we can install
         *  components and default component properties.
         */
        defaultComponents: {
          // Use our hit test component so that we can use the reticle to detect
          // surfaces.
          'ar-hit-test': {},
          // We want the reticle to be flat on the floor, so we need to rotate 90
          // degrees around the x-axis.
          rotation: {
            x: -90,
            y: 0,
            z: 0
          }
        },

        /**
         *  These are the HTML attributes for the reticle.
         */
        mappings: {
          // We want to map the HTML attribute for the target and the hit test to
          // the hit test component.
          target: name + '.target',
          testing: name + '.doHitTest'
        }
      });
    };
    /**
     *  Private method to register the hit test component with AFRAME that the
     *  a-reticle element relies on to perform the hit tests.
     *  @param    {string}    name    Name of the AR hit test component.
     */

    _registerComponent = name => {
      // Keep the class in scope.
      const reticle = this; // Register the component.

      if (!AFRAME.components[name]) AFRAME.registerComponent(name, {
        /**
         *  Here we can define the properties of the object. We can determine
         *  their types and default values.
         */
        schema: {
          // ???
          target: {
            type: "selector"
          },
          // We want to keep track of whether we are currently performing hit
          // tests or not.
          doHitTest: {
            type: 'boolean',
            default: true
          }
        },

        /**
         *  This function is always called once during the beginning of the
         *  lifecycle of the component. We can use it to declare some variables on
         *  the component and add event listeners.
         */
        init: function () {
          // We want to keep track of the HitTest object that we've previously
          // instantiated.
          this.hitTest = null; // We want to keep track of whether we've already found a pose or not.

          this.hasFoundAPose = false; // Event handler for when the ession ends.

          this.onSessionEnd = () => {
            // When the session ends, we want to reset our state variables.
            this.hitTest = null;
            this.hasFoundAPose = false;
          }; // Event handler for when the ession starts.


          this.onSessionStart = async () => {
            // Get the renderer and the session from the element.
            const renderer = this.el.sceneEl.renderer;
            const session = this.session = renderer.xr.getSession(); // this.hasFoundAPose = false;
            // By default, we want to user to be able to place the reticle by
            // pointing their camera around. That is why we use the reference
            // space from the viewer's point of view here.

            const viewerSpace = await session.requestReferenceSpace('viewer');
            const viewerHitTest = new HitTest(renderer, {
              space: viewerSpace
            });
            this.hitTest = viewerHitTest;
          }; // Listen for the WebXR session to start and end.


          this.el.sceneEl.renderer.xr.addEventListener("sessionstart", this.onSessionStart);
          this.el.sceneEl.renderer.xr.addEventListener("sessionend", this.onSessionEnd);
        },

        /**
         *  Method that is called on each frame of the scene's render loop.
         *  @param  {integer}   time      Number of milliseconds that have passed
         *                                since the start of the session.
         *  @param  {integer}   timeDelta Number of milliseconds that have passed
         *                                since the last frame.
         */
        tick: function (time, timeDelta) {
          // If we are not tasked with doing a hit test, we shouldn't do anything.
          if (!this.data.doHitTest) return; // Get access to the current frame.

          const frame = this.el.sceneEl.frame; // If there is no frame, we cannot perform a hit test.

          if (!frame) return; // If we don't have an instance of a HitTest, we cannot perform the hit
          // test for this frame.

          if (!this.hitTest) return; // Perform the hit test for this frame.

          const result = this.hitTest.doHit(frame); // If there is no result, the hit test failed and we should probably not
          // display the reticle for this frame.

          if (!result) {
            // Hide the reticle.
            this.el.setAttribute('visible', false); // Signal a failed hit test.

            reticle._success(false); // No need to continue.


            return;
          } // Get the pose and the appropriate input space from the results of
          // the hit test.


          const {
            pose,
            inputSpace
          } = result; // Try to get the pose for this frame.

          try {
            this.currentControllerPose = frame.getPose(inputSpace, this.el.sceneEl.renderer.xr.getReferenceSpace());
          } // Log any errors that occur.
          catch (error) {
            console.error(e);
          } // Remember that we've now found a pose.


          this.hasFoundAPose = true; // Make the reticle visible and update its position and orientation.

          this.el.setAttribute('visible', true);
          this.el.setAttribute("position", pose.transform.position);
          this.el.object3D.quaternion.copy(pose.transform.orientation); // Signal a successful hit test.

          reticle._success(true);
        },

        /**
         *  Method that is called when the component or its parent element is
         *  removed. We can use it to clean up memory.
         */
        remove: function () {
          // Remove the event listeners from the WebXR session.
          this.el.sceneEl.renderer.xr.removeEventListener("sessionstart", this.onSessionStart);
          this.el.sceneEl.renderer.xr.removeEventListener("sessionend", this.onSessionEnd);
        }
      });
    };
    /**
     *  Private method to signal a successful or failed hit test.
     *  @param    {boolean}     success     Was the hit test successful or not?
     */

    _success = success => {
      // If nothing has changed, we have nothing to do.
      if (this._latestSuccess == success) return; // Remember the state of the latest hit test.

      this._latestSuccess = success; // Trigger the appropriate event.

      if (success) this.trigger("success");else this.trigger("fail");
    };
    /**
     *  Method to expose the reticle's position attributes.
     *  @returns  {string}
     */

    position = () => {
      return this._container.getAttribute("position");
    };
    /**
     *  Method to expose the reticle's rotation attributes.
     *  @returns  {string}
     */

    rotation = () => {
      return this._container.getAttribute("rotation");
    };
    /**
     *  Method to show the scene.
     *  @returns  {Reticle}
     */

    show() {
      // We want to reset the latest success variable so that the reticle will
      // automatically trigger a success event if it immediately has a successful
      // hit test after it is being shown again.
      this._success(false); // Make sure that we're performing hit tests.


      this._container.setAttribute("testing", true); // Allow chaining.


      return this;
    }
    /**
     *  Method to hide the scene.
     *  @returns  {Reticle}
     */


    hide() {
      // Make sure we hide the reticle.
      this._container.setAttribute("visible", false); // We don't need to perfom hit tests while the reticle is hidden.


      this._container.setAttribute("testing", false); // Allow chaining.


      return this;
    }
    /**
     *  Method to remove this object and clean up after itself.
     */


    remove() {
      // Clear the cache
      this._cache.clear(); // Call the BaseElement remove method.


      super.remove();
    }

  } // Export the Reticle class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the ArModel class that can be used as a base for any
   *  class that is based on a DOM element.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class ArModel extends BaseElement {
    /**
     *  This is the object that can make the HTTP requests needed in this class.
     *  @var      {Request}
     */
    _request = null;
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */

    _container = null;
    /**
     *  Keep an array of all models and their positions.
     *  @var      {Array}
     */

    _models = [];
    /**
     *  Reference to the current position of the model.
     *  @var      {Vector3}
     */

    _position = null;
    /**
     *  Reference to the current rotation of the model.
     *  @var      {Object}
     */

    _rotation = null;
    /**
     *  Keep the model's dimension in cache.
     *  @var      {Object}
     */

    _dimensions = null;
    /**
     *  Class constructor.
     *  @param    {Element}     parent    The parent container to which the
     *                                    ArModel will be added.
     *  @param    {...any}      options   Optional initial options that will be
     *                                    passed to the update method.
     */

    constructor(parent, ...options) {
      // First call the BaseElement constructor.
      super(); // Create a container for the model.

      this._container = document.createElement('a-entity');

      this._container.classList.add('ar-model'); // We need to be able to make HTTP requests later to load the models.


      this._request = new Request(); // Call the update method with any initial settings.

      if (options.length) this.update(...options); // Add the container to the parent element.

      parent.appendChild(this._container);
    }
    /**
     *  Method to update the parameters of this model.
     *  @param    {string}    model       The object ID.
     *  @param    {Number}    number      The number of objects we should spawn.
     *  @param    {Number}    scale       The scale at which the model should be
     *                                    shown.
     *  @returns  {Promise}
     */


    update = async (model, number = 1, scale = 1) => {
      // Hide the model while updating.
      this.hide(); // Update the source and the distance.

      const source = this._request.model(model); // Remove all current models.


      this.clear(); // Keep track of all promises for loading the models.

      const promises = []; // Start adding models.

      for (let i = 0; i < number; i++) promises.push(this._addModel(source, scale)); // Return the promise that all models have loaded.


      return Promise.all(promises) // Wait for all models to load.
      .then(() => {
        // Get the dimensions for the new model.
        this._dimensions = this._modelDimensions(); // Position the model properly and show it.

        this.position().show();
      });
    };
    /**
     *  Method to move the model to a new position.
     *  @param    {Vector3}   vector    The vector that describes the new location
     *                                  to move to.
     *  @param    {Object}    vector    The vector that describes the way the
     *                                  model should be rotated.
     *  @returns  {ArModel}
     */

    position = (position, rotation) => {
      // Make sure our cache and current position are up to date.
      if (position) this._position = position;else position = this._position; // Make sure our cache and current rotation are up to date.

      if (rotation) this._rotation = rotation;else rotation = this._rotation; // We need both a position and a rotation to continue.

      if (!position || !rotation) return this; // Get the current number of models.

      const number = this._models.length; // Get the number of models in a single row.

      const row = Math.ceil(Math.pow(number, 1 / 3)); // Get the number of models on a single floor.

      const floor = row ** 2; // Get an object describing the model's dimensions.

      const dimensions = this._dimensions; // Create the position vector for the first model in the corner. We can
      // clone the providing position object so that we're sure that we're working
      // with the same type of vector.

      const start = position.clone() // First, we subtract the offset so that the model expands to the right
      // from the starting position. Then, we subtract half the width of the
      // models in a single row to center the model around the x axis.
      .setX(position.x - dimensions.xOffset - row * dimensions.width / 2) // We always want to start on the surface and grow upwards.
      .setY(position.y - dimensions.yOffset) // First, we subtract the offset so that the model expands to the front
      // from the starting position. Then, we subtract half the depth of the
      // models in a single row to center the model around the z axis.
      .setZ(position.z - dimensions.zOffset - row * dimensions.depth / 2); // We need one vector that we're constantly updating to reposition each
      // model. We can start by simply cloning the start vector.

      const update = start.clone(); // Loop through all models.

      for (let i = 0; i < this._models.length; i++) {
        // We want to change the x coordinate every iteration and reset every row,
        // or whenever the index is divisible by the length of the row.
        const xLevel = i % row; // We want to change the y coordinate every floor and we don't need to
        // reset.

        const yLevel = ~~(i / floor); // We want to change the z coordinate every row and we need to reset every
        // floor.

        const zLevel = ~~(i / row) % row; // Apply the changes to the update vector.

        update.setX(start.x + xLevel * dimensions.width).setY(start.y + yLevel * dimensions.height).setZ(start.z + zLevel * dimensions.depth); // Get the model.

        const model = this._models[i]; // Update the model's position.

        model.setAttribute("position", update); // Update the model's rotation.

        model.setAttribute("rotation", rotation);
      } // Allow chaining.


      return this;
    };
    /**
     *  Method to get an object describing certain model specific parameters.
     *  @returns    {Object}
     *    @property {Number}      width     Size of the model along the x axis.
     *    @property {Number}      height    Size of the model along the y axis.
     *    @property {Number}      depth     Size of the model along the z axis.
     *    @property {Number}      yOffset   Distance between the model and the
     *                                      floor.
     */

    _modelDimensions = () => {
      // We can use any model for this, as they all have the same source.
      const model = this._models[0]; // Did we get a model?

      if (model) {
        // Get the 3D box from the model.
        const box = new AFRAME.THREE.Box3();
        box.setFromObject(model.object3D); // Return dimensions based on the box model.

        return {
          // Return the dimensions of the model.
          width: box.max.x - box.min.x,
          height: box.max.y - box.min.y,
          depth: box.max.z - box.min.z,
          // Include how far the left side of the model is off to the left.
          xOffset: box.min.x,
          // Include how far the model is floating off the floor.
          yOffset: box.min.y,
          // Include how close the front of the model is to the front.
          zOffset: box.min.z
        };
      } // Otherwise, return some arbitrary defaults.


      return {
        // Assume the model is a cubic meter in size.
        width: 1,
        height: 1,
        depth: 1,
        // Assume the model is exactly where it says it is.
        xOffset: 0,
        yOffset: 0,
        zOffset: 0
      };
    };
    /**
     *  Method to add a new model.
     *  @param    {string}      source      URL to load the model.
     *  @param    {string}      scale       Scale at which to display the model.
     *  @returns  {Promise}
     */

    _addModel = async (source, scale) => {
      // Return a promise.
      return new Promise((resolve, reject) => {
        // Create a new GLTF model element to use in the DOM.
        const model = document.createElement("a-gltf-model"); // Add the object class to the new element.

        model.classList.add("arscene-object"); // Make sure we can see the model.

        model.setAttribute("visible", "true"); // Set the model scaling.

        model.object3D.scale.set(scale, scale, scale); // Add the model element to the container.

        this._container.appendChild(model); // Add the model object to our models array.


        this._models.push(model); // Resolve the promise as soon as the model has loaded.


        model.addEventListener('model-loaded', resolve); // Start loading the model.

        model.setAttribute("src", source);
      });
    };
    /**
     *  Method to remove a single model.
     */

    _removeModel = () => {
      // Get the last model from the array.
      const model = this._models.pop(); // Remove the model.


      model.remove();
    };
    /**
     *  Method to remove to remove all models.
     *  @returns  {ArModel}
     */

    clear = () => {
      // Keep removing models until there are none left.
      while (this._models.length) this._removeModel(); // Allow chaining.


      return this;
    };
    /**
     *  Method to show this element.
     *  @returns  {ArModel}
     */

    show() {
      // Make sure we're not hiding.
      super.show(); // We also need to seperately hide all of our models.

      for (const model of this._models) model.setAttribute('visible', 'true'); // Allow chaining.


      return this;
    }
    /**
     *  Method to hide this element.
     *  @returns  {ArModel}
     */


    hide() {
      // Make sure we're hiding.
      super.hide(); // We also need to seperately hide all of our models.

      for (const model of this._models) model.setAttribute('visible', 'false'); // Allow chaining.


      return this;
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Remove any classes we've constructed.
      if (this._request) this._request.remove(); // Remove all models.

      for (const model of this._models) model.remove(); // Reset the array.


      this._models = []; // Call the BaseHandler's remove function.

      super.remove();
    }

  } // Export the ArModel class so it can be imported elsewhere.

  /**
   *  Helper function to debounce the execution of an action. The function that is
   *  passed will be executed after the given delay. This delay is reset every
   *  time this debounce function is called again before the function is called.
   *
   *  @param    {function}    func    Function that will ultimately be executed.
   *  @param    {integer}     delay   The minimum number of milliseconds that
   *                                  have to pass before the function is
   *                                  called.
   *  @returns  {function}
   */
  const debounce = (func, delay) => {
    // Set a timer.
    let timer; // Return the debounced function.

    return function () {
      // Keep track of the context and the arguments that should be passed to the
      // function when it is executed.
      const context = this;
      const args = arguments; // Create a function that executes once the timer runs out.

      const later = () => {
        // Reset the timer.
        timer = null; // Execute the function.

        func.apply(context, args);
      }; // Reset the delay on the timer the debouncing function is called.


      clearTimeout(timer);
      timer = setTimeout(later, delay);
    };
  }; // Export the debounce function.

  /**
   *  The definition of the AttributeObserver class that can be used to observe
   *  attribute changes for certain DOM elements. It behaves much like the
   *  EventHandler class, except instead of event names, it accepts DOM elements.
   *  The important differences with the EventHandler class are that this class
   *  only allows for one callback per target, and it cannot be manually
   *  triggered. Instead, it is automatically triggered by mutations on the target
   *  element.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */
  class AttributeObserver {
    /**
     *  Private variable for targets to track.
     *  @var      object
     */
    _targets = new Map();
    /**
     *  We want to keep track of the running mutation observer.
     *  @var  {MutationObserver}
     */

    _observer = null;
    /**
     *  Class constructor.
     */

    constructor() {
      // Create a new Mutation observer.
      this._observer = new MutationObserver(mutations => {
        // Loop through all mutations.
        for (const mutation of mutations) {
          // If this is not a mutation to the attributes of the target element, we
          // should ignore this mutation.
          if (mutation.type != 'attributes') return; // Call the callback function that we've registered for this target, if
          // any.

          if (this._targets.has(mutation.target)) this._targets.get(mutation.target)(mutation);
        }
      });
    }
    /**
     *  Method to show this element.
     *  @param    {Element}     target  DOM element that is to be observed for
     *                                  attribute changes.
     *  @returns  {AttributeObserver}
     */


    on(target, callback) {
      // We only know how to handle DOM elements.
      if (!target instanceof Element) return; // Add this target to our mapping.

      this._targets.set(target, callback); // Start observing the target.


      this._observer.observe(target, {
        attributes: true
      }); // Allow chaining.


      return this;
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Can't remove anything if it has already been removed.
      if (!this._observer) return; // Disconnect the observer.

      this._observer.disconnect(); // Remove the reference to the observer so that it can be garbage collected.


      this._observer = null; // Clear all targets.

      this._targets.clear();
    }

  } // Export the AttributeObserver class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the ArScene class that can be used to create an an
   *  augmented reality session.
   *
   *  @event      end           Triggered when the augmented reality session has
   *                            ended.
   *  @event      error         Triggered when an unrecoverable error has
   *                            occurred.
   *  @event      loaded        Triggered when the scene has loaded and can be
   *                            started.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class ArScene extends BaseElement {
    /**
     *  Private variable that keeps track of the current mode of the scene. We
     *  always start out in inactive mode.
     *  Valid values are: "inactive", "placing", and "viewing"
     *  @var      {string}
     */
    _mode = "inactive";
    /**
     *  Private variable that stores a reference to the Aframe scene.
     *  @var      {Element}
     */

    _scene = null;
    /**
     *  Private variable that stores a reference to the Aframe reticle.
     *  @var      {Reticle}
     */

    _reticle = null;
    /**
     *  Private variable that stores a reference to the Aframe 3D object.
     *  @var      {Element}
     */

    _model = null;
    /**
     *  Private variable that stores a reference to the container that houses all
     *  assets that are used for the 3D object.
     *  @var      {Element}
     */

    _assets = null;
    /**
     *  Private variable that stores a reference to the Overlay object.
     *  @var      {Overlay}
     */

    _overlay = null;
    /**
     *  Private variable that stores a reference to the container that houses the
     *  overlay.
     *  @var      {Element}
     */

    _overlayContainer = null;
    /**
     *  Private variable that stores a reference to the container that houses the
     *  augmented reality interface that we can attach the overlay to.
     *  @var      {Element}
     */

    _interface = null;
    /**
     *  Private variable that stores a reference to the overlay proceed button.
     *  @var      {Element}
     */

    _proceedButton = null;
    /**
     *  Private variable that stores a reference to the overlay stop button.
     *  @var      {Element}
     */

    _stopButton = null;
    /**
     *  Private variable that stores a reference to the overlay instructions.
     *  @var      {Element}
     */

    _instructions = null;
    /**
     *  Private variable that stores a reference to the overlay title.
     *  @var      {Element}
     */

    _overlayTitle;
    /**
     *  Private variable that stores the texts for this scene.
     *  @var      {object}
     */

    _texts = null;
    /**
     *  Private variable that stores the attribute observer that we use to remove
     *  the 'a-fullscreen' class that Aframe likes to add to the HTML element.
     *  @var      {AttributeObserver}
     */

    _observer = null;
    /**
     *  Reference to the product that we're showing. This object also contains an
     *  array with the models we're showing.
     *  @var      {Object}
     */

    _product = null;
    /**
     *  While we're showing different models, we need to keep track of the index
     *  of the model that we're currently showing. We can set this to any negative
     *  number to indicate that we're not showing any model right now.
     *  @var      {Number}
     */

    _modelIndex = -1;
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element on which the
     *                                  overlay interface will be installed.
     *  @param    {object}    texts     This is an object that provides texts for
     *                                  the augmented reality scene.
     *    @property {string}    "exit-button"         Text for the exit button.
     *    @property {string}    "placing-title"       Title text in placing mode.
     *    @property {string}    "placing-description" Description in placing mode.
     *    @property {string}    "placing-button"      Button text in placing mode.
     */

    constructor(parent, texts) {
      // Call the base class constructor.
      super(); // Store the texts we need to use.

      this._texts = texts; // Initialize the interface.

      this._initInterface(parent);
    }
    /**
     *  Private method for initializing the DOM interface.
     *  @param    {Element}   parent    The parent element on which the overlay
     *                                  and the scene will be installed.
     */


    _initInterface = parent => {
      // Create a container for the barcode scanner.
      this._container = document.createElement("div");

      this._container.classList.add("arscene"); // Create the overlay in this container.


      this._createOverlay(this._container); // Create the scene in this container.


      this._createScene(this._container); // Make sure that all interface elements are initially hidden.


      this.hide(); // Add the entire interface to the parent container.

      parent.appendChild(this._container);
    };
    /**
     *  Private method for creating an Aframe scene for augmented reality.
     *  @param    {Element}   parent    The parent element on which the scene will
     *                                  be installed.
     */

    _createScene = parent => {
      // Create the Aframe scene element.
      this._scene = document.createElement("a-scene");

      this._scene.classList.add("arscene-scene");

      this._scene.setAttribute("visible", "false"); // Disable the custom UI that Aframe adds onto the scene. We should provide
      // our own button for entering AR.


      this._scene.setAttribute("vr-mode-ui", "enabled: false"); // Make sure we can have access to the hit test feature, attach the overlay,
      // and initialize the AR session at the user's feet.


      this._scene.setAttribute("webxr", "optionalFeatures: hit-test, local-floor, dom-overlay; overlayElement: .arscene-overlay;"); // Add a reticle to the scene.


      this._reticle = new Reticle(this._scene); // By default, we should only enable the proceed button when the reticle is
      // showing.

      this._startReticleSync(); // Add the overlay to the scene.


      this._addOverlayToScene(this._scene); // Add the new model to the scene. Hide it by default.


      this._model = new ArModel(this._scene).hide(); // Add the scene to the parent container.

      parent.prepend(this._scene); // Aframe may attempt to add 'a-fullscreen to the HTML element on the page.
      // This class helps create a fullscreen orientation, but it sacrifices
      // scrolling. Because we're in a single page application, this might mess up
      // different parts of the application, so we want to remove this class so
      // that we can offload this responsibility elsewhere (like the
      // Representation class).

      this._preventClass("html", "a-fullscreen"); // Check to see if the renderer has already started. If so, we can
      // immediately initialize the scene.


      if (this._scene.renderStarted) this._initScene(); // Otherwise, we need to wait for the scene element to load first.
      else this._scene.addEventListener("loaded", () => void this._initScene());
    };
    /**
     *  Private method to watch a single DOM element and remove a certain class
     *  from that element as soon as it appears. It will only prevent this
     *  behaviour once.
     *  @param  {string}    tagName     Name of the DOM element tag.
     *  @param  {string}    className   Name of the class that should be
     *                                  prevented.
     */

    _preventClass = (tagName, className) => {
      // Get the first occurrence of this tag.
      const tag = document.getElementsByTagName(tagName)[0]; // Create a new attribute observer to observe changes in the DOM.

      this._observer = new AttributeObserver(); // Start observing our element.

      this._observer.on(tag, mutation => {
        // No need to observe anything but class changes.
        if (mutation.attributeName != "class") return; // If the HTML element does not yet have the specific class, we should
        // keep waiting.

        if (!tag.classList.contains(className)) return; // Remove the class.

        tag.classList.remove(className); // After we've removed the class we can stop observing the HTML element
        // and we no longer need the attribute observer.

        this._observer.remove();
      });
    };
    /**
     *  Private method for initializing the scene by adding event listeners and
     *  triggering the loaded event.
     */

    _initScene = () => {
      // Add an event listener to the scene to detect when the user has exited the
      // scene.
      this._scene.addEventListener("exit-vr", () => void this.stop()); // Add an event listener to the scene to detect when the user has entered
      // the scene.


      this._scene.addEventListener("enter-vr", () => void this._activateScene()); // Announce that the scene has finished loading.


      this.trigger("loaded");
    };
    /**
     *  Method to activate the augmented reality scene.
     */

    _activateScene = () => {
      // Did we end up in virtual reality mode?
      if (this._scene.is("vr-mode")) return this._handleError("VR mode is not yet implemented."); // Did we fail to get to augmented reality mode?

      if (!this._scene.is("ar-mode")) return this._handleError("Could not enter augmented reality mode."); // Do we have a DOM overlay?

      const domOverlay = !!(this._scene.xrSession.domOverlayState && this._scene.xrSession.domOverlayState.type); // Mount the overlay in the augmented reality session.

      this._overlayContainer.setAttribute('text', 'value', 'Overlay: ' + domOverlay); // Make sure the overlay is visible.


      this._overlayContainer.setAttribute('visible', 'true'); // Make sure the augmented reality scene is visible.


      this._scene.setAttribute('visible', 'true'); // Go to placing mode.


      this._placeModel();
    };
    /**
     *  Private method for handling errors.
     *  @param    {string}    message A message explaining what went wrong.
     */

    _handleError = message => {
      // Trigger the error event.
      this.trigger("error", message);
    };
    /**
     *  Private method for adding a interface in an Aframe scene. This interface
     *  is an object in augmented reality that is attached to the camera view that
     *  we can attach the overlay to.
     *  @param    {Element}   scene   The Aframe scene to which the interface is
     *                                added.
     */

    _addOverlayToScene = scene => {
      // Create an Aframe camera element. To add the overlay to the scene, we can
      // create an interface in a camera object that we can mount the overlay to.
      const camera = document.createElement("a-camera"); // Create an Aframe entity element for the interface.

      this._interface = document.createElement("a-entity");

      this._interface.classList.add("arscene-interface");

      this._interface.setAttribute("text", "align: left; width: 0.1;");

      this._interface.setAttribute("position", "0 0 -0.25;");

      this._interface.setAttribute("visible", "false"); // Add the interface to the camera.


      camera.appendChild(this._interface); // Add the camera to the scene.

      scene.appendChild(camera);
    };
    /**
     *  Private method for creating an overlay for the interface.
     *  @param    {Element}   parent    The parent element on which the overlay
     *                                  will be installed.
     */

    _createOverlay = parent => {
      // Create a container for the overlay element.
      this._overlayContainer = document.createElement("div");

      this._overlayContainer.classList.add("arscene-overlay"); // Create an overlay object.


      this._overlay = new Overlay(this._overlayContainer); // Add a title to the overlay.

      this._overlayTitle = this._overlay.add("h1", {
        location: "top"
      }); // Add a description to the overlay.

      this._instructions = this._overlay.add("p", {
        location: "top"
      }); // Add a proceed button to the overlay.

      this._proceedButton = this._overlay.add("button"); // Add event listeners to this button with a debounced callback.

      this._allowProceed(); // Add an stop button to the overlay.


      this._stopButton = this._overlay.add("button", {
        text: this._texts["exit-button"] || 'Exit'
      }); // Add event listeners to this button with a debounced callback. We want
      // this to just end the XR session. The event listener on the session will
      // then call the stop method.

      const stopHandler = debounce(() => void this._scene.xrSession.end(), 500);

      this._stopButton.addEventListener('mousedown', stopHandler);

      this._stopButton.addEventListener('touchstart', stopHandler); // Add the overlay container to the parent container.


      parent.appendChild(this._overlayContainer);
    };
    /**
     *  Private method to proceed to the mode for finding a location to place the
     *  object.
     */

    _placeModel = () => {
      // We need to disable the proceed button when the reticle is hidden.
      this._startReticleSync(); // Reset the model index.


      this._modelIndex = -1; // We need the reticle to show.

      this._reticle.show(); // Make sure the 3D object is not visible.


      this._model.hide(); // Update the text of the overlay title.


      this._overlayTitle.textContent = this._texts["placing-title"] || ""; // Update the text for the instructions.

      this._instructions.textContent = this._texts["placing-description"] || ""; // Update the text on the proceed button. We should always have a text here.

      this._proceedButton.textContent = this._texts["placing-button"] || 'Place';
    };
    /**
     *  Private method to proceed to the mode for viewing the placed object.
     */

    _showModel = () => {
      // We need to stop synchronizing the reticle with the proceed button.
      this._stopReticleSync(); // Get the current model.


      const source = this._product.models[this._modelIndex]; // Load the model source.

      this._model.update(source._id, source.multiplier, source.scale) // Wait for the model to load to set the model's position and rotation.
      .then(() => {
        // If this is not the first model we're showing, it's already got the
        // correct position and rotation and we don't need to provide it again.
        if (this._modelIndex != 0) return; // We need to hide the reticle.

        this._reticle.hide(); // Update the model's position to be where the reticle is now
        // and show it.


        this._model.position(this._reticle.position(), this._reticle.rotation()).show();
      }); // Update the text of the overlay title.


      this._overlayTitle.textContent = source["viewing-title"] || ""; // Update the text for the instructions.

      this._instructions.textContent = source["viewing-description"] || ""; // Update the text on the proceed button. We always need a text for the
      // button so we should have a fallback.

      this._proceedButton.textContent = source["viewing-button"] || "Proceed";
    };
    /**
     *  Method that returns whether the augmented reality scene has loaded yet.
     *  @returns  {boolean}
     */

    active = () => this._scene.renderStarted;
    /**
     *  Method for proceeding to the next step.
     *  @returns  {ArScene}
     */

    proceed = () => {
      // Increment the index of the model we are showing.
      this._modelIndex += 1; // Do we still have a valid index?

      if (this._modelIndex < this._product.models.length) this._showModel(); // Otherwise, we can go back to placing a model.
      else this._placeModel(); // Allow chaining.

      return this;
    };
    /**
     *  Private debounced version of the proceed method.
     */

    _proceedHandler = debounce(() => void this.proceed(), 500);
    /**
     *  Private method to synchronize the reticle with the proceed button in that
     *  we enable the proceed button only when the reticle is showing.
     */

    _startReticleSync = () => {
      // Disable the proceed button until the reticle is showing.
      this._preventProceed(); // Install event listeners that enable and disable the proceed button
      // depending on whether the reticle is showing.


      this._reticle.on("success", this._allowProceed).on("fail", this._preventProceed);
    };
    /**
     *  Private method to stop synchronizing the reticle with the proceed button.
     *  Instead, the proceed button should be enabled.
     */

    _stopReticleSync = () => {
      // Remove the event listeners that enable and disable the proceed button
      // depending on whether the reticle is showing.
      this._reticle.off("success", this._allowProceed).off("fail", this._preventProceed); // Enable the proceed button.


      this._allowProceed();
    };
    /**
     *  Private method to disable the proceed button.
     */

    _preventProceed = () => {
      // Remove the event handlers for the proceed button.
      this._proceedButton.removeEventListener('mousedown', this._proceedHandler);

      this._proceedButton.removeEventListener('touchstart', this._proceedHandler); // Make sure the proceed button is disabled.


      this._proceedButton.disabled = true;
    };
    /**
     *  Private method to enable the proceed button.
     */

    _allowProceed = () => {
      // Add the event handlers for the proceed button.
      this._proceedButton.addEventListener('mousedown', this._proceedHandler);

      this._proceedButton.addEventListener('touchstart', this._proceedHandler); // Make sure the proceed button is not disabled.


      this._proceedButton.disabled = false;
    };
    /**
     *  Method to select a 3D object to show.
     *  @param    {Object}    product     Object container the properties of the
     *                                    selected product.
     *  @returns  {ArScene}
     */

    select = product => {
      // Store the product.
      this._product = product; // Immediately enter the augmented reality mode. This could fail, for
      // example if WebXR is not available or the user has not given
      // permission.

      try {
        // Enter augmented reality.
        this._scene.enterAR(); // Then show the scene.


        this.show();
      } catch (error) {
        this._handleError(error);
      } // Allow chaining.


      return this;
    };
    /**
     *  Method for stopping the augmented reality session.
     *  @returns  {ArScene}
     */

    stop = () => {
      // Hide the reticle. This will make sure that it is no longer running hit
      // tests in the background.
      this._reticle.hide(); // Trigger the end event.


      this.trigger('end'); // Allow chaining.

      return this;
    };
    /**
     *  Private debounced version of the stop method.
     */

    _stopHandler = debounce(() => void this.stop(), 500);
    /**
     *  Method to show this element.
     *  @returns  {ArScene}
     */

    show() {
      // Make sure we are also able to show the reticle.
      this._reticle.show(); // Make sure we're showing.


      super.show(); // Allow chaining.

      return this;
    }
    /**
     *  Method to hide this element.
     *  @returns  {ArScene}
     */


    hide() {
      // Make sure we also hide the reticle.
      this._reticle.hide(); // Make sure we're hiding.


      super.hide(); // Allow chaining.

      return this;
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Stop the session.
      this.stop(); // Remove the other objects we've used.

      if (this._overlay) this._overlay.remove();
      if (this._reticle) this._reticle.remove();
      if (this._observer) this._observer.remove(); // Remove all DOM elements we've stored.

      if (this._scene) this._scene.remove();
      if (this._model) this._model.remove();
      if (this._assets) this._assets.remove();
      if (this._overlayContainer) this._overlayContainer.remove();
      if (this._interface) this._interface.remove();
      if (this._proceedButton) this._proceedButton.remove();
      if (this._stopButton) this._stopButton.remove();
      if (this._instructions) this._instructions.remove(); // Call the original remove method.

      super.remove();
    }

  } // Export the ArScene class so it can be imported elsewhere.

  // Import dependencies
  /**
   *  The definition of the ScriptLoader class that can be used to dynamically
   *  load an internal Javascript library.
   *
   *  @event      loaded        Triggered each time one specific script has
   *                            loaded. Both the path and a reference to the
   *                            script tag will be added to the event object.
   *  @event      failed        Triggered each time one specific script has
   *                            failed to load. Both the path and a reference to
   *                            the script tag will be added to the event object.
   *  @event      loaded-all    Triggered when all scripts have been loaded.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class ScriptLoader extends EventHandler {
    /**
     *  An array to keep track of the script that are we still have to start
     *  loading.
     *  @var      {array}
     */
    _toLoad = [];
    /**
     *  A map to keep track of the script that are currently loading. It will map
     *  the paths to the actual script elements in the DOM.
     *  @var      {Map}
     */

    _loading = new Map();
    /**
     *  A map to keep track of the script that are have succesfully loaded. It
     *  will map the paths to the actual script elements in the DOM.
     *  @var      {Map}
     */

    _loaded = new Map();
    /**
     *  A map to keep track of the script that are have failed to load. It will
     *  map the paths to the actual script elements in the DOM.
     *  @var      {Map}
     */

    _failed = new Map();
    /**
     *  A reference to the head of the page.
     *  @var      {Element}
     */

    _head = null;
    /**
     *  Class constructor.
     *  @param    {array}     paths     An array of paths to Javascript libraries
     *                                  that should be loaded.
     */

    constructor(paths) {
      // First initialize the EventHandler class.
      super(); // Store a reference to the head element of the page.

      this._head = document.getElementsByTagName('head')[0]; // Load all scripts.

      if (paths) this.loadAll(paths);
    }
    /**
     *  Method for handling when a Javascript library has successfully loaded.
     *  @param    {Event}     event     Event object describinig the error that
     *                                  occurred.
     */


    _loadHandler = event => {
      // Get the script element and the path to the Javascript library from the
      // event.
      const script = event.target;
      const path = script.slug; // Move the script element to our map of loaded scripts.

      this._loading.delete(path);

      this._loaded.set(path, script); // Trigger a loaded event for loading this specific script.


      this.trigger("loaded", {
        path: path,
        element: script
      }); // Trigger the loaded-all event if that all scripts have loaded.

      if (!this._toLoad.length && !this._loading.size && !this._failed.size) this.trigger("loaded-all");
    };
    /**
     *  Method for handling errors.
     *  @param    {Event}     event     Event object describing the error that
     *                                  occurred.
     */

    _errorHandler = event => {
      // Get the script element and the path to the Javascript library from the
      // event.
      const script = event.target;
      const path = script.slug; // Move the script tag to our map of failed scripts.

      this._loading.delete(path);

      this._failed.set(path, script); // Trigger a failed event with information about this specific script.


      this.trigger("failed", {
        path: path,
        tag: script
      });
    };
    /**
     *  Private method that checks if a script has been loaded before.
     *  @param    {string}      path    Path to a Javascript library.
     */

    _alreadyLoaded = path => document.querySelector(`script[src*="${path}"]`);
    /**
     *  Method to dynamically load an internal Javascript library.
     *  @param    {array}     paths     An array of paths to Javascript libraries
     *                                  that should be loaded.
     *  @returns  {ScriptLoader}
     */

    loadAll = paths => {
      // Store the list of scripts we should load.
      this._toLoad = paths; // Load all paths.

      for (const path of paths) this.load(path); // Allow chaining.


      return this;
    };
    /**
     *  Method to dynamically load an internal Javascript library.
     *  @param    {string}      path    Path to a Javascript library.
     *  @returns  {ScriptLoader}
     */

    load = path => {
      // We shouldn't load libraries twice.
      if (this._loading.has(path) || this._loaded.has(path)) return; // If we've failed loading this script before, we'll try again fresh.

      if (this._failed.has(path)) this._failed.delete(path); // Check if this script was already loaded before.

      const alreadyLoaded = this._alreadyLoaded(path); // If so, we want to use that script tag to trigger the events. We should
      // not attempt to load it again as that may trigger errors.


      if (alreadyLoaded) {
        // Remove this path from the toLoad array.
        this._toLoad = this._toLoad.filter(listed => path != listed); // Trigger the appropriate loaded events.

        this._loadHandler({
          target: alreadyLoaded
        }); // We do not need to do anything else. Allow chaining.


        return this;
      }
      // tag to the DOM. This is a safe way to load a new script.

      const script = document.createElement('script');
      script.type = 'text/javascript'; // Install the handlers.

      script.onerror = this._errorHandler;
      script.onload = this._loadHandler; // Move the script to our loading list.

      this._toLoad = this._toLoad.filter(listed => path != listed);

      this._loading.set(path, script); // Add the script to the head of the page and add the script source so it
      // can start loading the script.


      this._head.appendChild(script);

      script.src = path; // When setting the src attribute on the HTMLScriptElement, the browser will
      // automatically add the current URL to the script. This is great for
      // loading the script, but makes this attribute hard to use as our key. To
      // make sure we have a recognizable path to use, we can store the string in
      // a separate variable on the script element that we call 'slug'. This time
      // the browser will not add the current URL to the path, allowing us to
      // easily use it as a key.

      script.slug = path; // Allow chaining.

      return this;
    };
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */

    remove() {
      // Reset the list of items we have to load.
      this._toLoad = []; // In this case, it does not make sense to remove the script tags. They
      // serve as proof that these libraries have been loaded, so it is more
      // useful to leave them in the DOM. We should still remove the reference to
      // the DOM elements so that they can be properly garbage collected if they
      // are removed from the DOM.

      this._head = null;

      this._loaded.clear();

      this._loading.clear();

      this._failed.clear(); // Call the EventHandler's remove function.


      super.remove();
    }

  } // Export the ScriptLoader class so it can be imported elsewhere.

  // Import dependencies
  /**
   *  The definition of the Representation class that can be used as to
   *  scan a product by its barcode and then show a 3D representation of that
   *  product in an augmented reality scene.
   *
   *  @event      error         Triggered when an unrecoverable error has
   *                            occurred.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Representation extends BaseElement {
    /**
     *  This is the object that can make the HTTP requests needed in this class.
     *  @var      {Request}
     */
    _request = null;
    /**
     *  We want to keep a reference to the current instance of the augmented
     *  reality scene.
     *  @var      {ArScene}
     */

    _scene = null;
    /**
     *  We want to keep a reference to the current instance of the barcode
     *  scanner.
     *  @var      {BarcodeScanner}
     */

    _scanner = null;
    /**
     *  For some parts of this product we need certain libraries to be loaded, so
     *  we want to keep track of the script loader.
     *  @var      {ScriptLoader}
     */

    _scriptLoader = null;
    /**
     *  We want to keep track of all products that we want to be able to scan.
     *  Here we map the product barcodes to an object with their information.
     *  @var      {object}
     */

    _products = {};
    /**
     *  This is the promise for requesting the products for this app.
     *  @var      {Promise}
     */

    _productsPromise = null;
    /**
     *  We want to keep track of the scanned product that we are currently showing
     *  to the user.
     *  @var      {object}
     */

    _shownProduct = null;
    /**
     *  We want to keep track of an HTML element where we can show the current
     *  @var      {Element}
     */

    _productDisplay = null;
    /**
     *  We want to keep track of the button that is used to select a product and
     *  enter the augmented reality scene.
     *  @var      {Element}
     */

    _selectButton = null;
    /**
     *  We need to keep track of the texts that we need to display in scanner and
     *  the scene.
     *  @var      {object}
     */

    _texts = null;
    /**
     *  This is the promise for requesting the texts for this app.
     *  @var      {Promise}
     */

    _textsPromise = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element on which the product
     *                                  representation will be installed.
     *  @param    {array}     options   Parameters.
     *    @property {string}    appPath   The path that identifies the app that
     *                                    we should shown.
     *
     */

    constructor(parent, options = {}) {
      // Initialize the BaseElement class.
      super(); // We need the Aframe and Quagga libraries for this. We should start loading
      // those libraries immediately.

      const quagga = "/quagga/quagga.min.js";
      const aframe = "/aframe/aframe.min.js";
      this._scriptLoader = new ScriptLoader(); // Get the object to make HTTP requests.

      this._request = new Request(); // Next, start loading products.

      this._loadProducts(options.appPath); // We need to know what texts to display in the overlay elements.


      this._loadTexts(options.appPath); // Listen for the scriptloader to load all scripts.


      this._scriptLoader.on("loaded-all", script => {
        // Wait for the HTTP response to get the app texts.
        this._textsPromise.then(response => {
          // Get access to the JSON object.
          if (response) return response.json().then(texts => {
            // Store the texts.
            this._texts = texts; // We need to at a class to facilitate fullscreen capabilities.

            this._enableFullscreen(); // Now start the barcode scanner and the augmented reality scene.


            this._loadBarcodeScanner();

            this._loadArScene(); // Check if there's already a barcode available in the URL.


            this._getProductFromUrl();
          });
        });
      }); // Start loading after we've installed the event listener.


      this._scriptLoader.loadAll([quagga, aframe]); // Create a container for the overlay.


      this._container = document.createElement("div");

      this._container.classList.add("representation"); // Add the overlay to the parent container.


      parent.appendChild(this._container);
    }
    /**
     *  Helper method to get a product barcode from the URL parameters.
     */


    _getProductFromUrl = () => {
      // Get a current URL object.
      const url = new URL(window.location.href); // Get the product parameter.

      const code = url.searchParams.get('product'); // Wait for the products to load.

      this._productsPromise.then(() => {
        // Then immediately process the barcode from the URL.
        this._processBarcode({
          code
        });
      });
    };
    /**
     *  In order to facilitate fullscreen, we're immitating the 'a-fullscreen'
     *  class that Aframe likes to add to the HTML element, but we only want to
     *  use this class when showing the prepresentation, so we're not using their
     *  'a-fullscreen' class, but compensate with own instead.
     *
     *  This method sets that class on the HTML element.
     */

    _enableFullscreen = () => {
      // Get the HTML element.
      const html = document.getElementsByTagName("html")[0]; // Add the representing mode styling to the HTML tag.

      html.classList.add("fullscreen");
    };
    /**
     *  In order to facilitate fullscreen, we're immitating the 'a-fullscreen'
     *  class that Aframe likes to add to the HTML element, but we only want to
     *  use this class when showing the prepresentation, so we're not using their
     *  'a-fullscreen' class, but compensate with own instead.
     *
     *  This method removes that class from the HTML element.
     */

    _disableFullscreen = () => {
      // Get the HTML element.
      const html = document.getElementsByTagName("html")[0]; // Remove the representing mode styling from the HTML tag.

      html.classList.remove("fullscreen");
    };
    /**
     *  Private method to load the augmented reality scene.
     */

    _loadArScene = () => {
      // Create a new augmented reality scene.
      this._scene = new ArScene(this._container, this._texts); // Propagate any error events that the scene might trigger.

      this._scene.on("error", errorMessage => void this.trigger("error", errorMessage)); // Listen for when the scene ends.


      this._scene.on('end', this._onSceneEnd); // Debounce the select handler.


      const selectHandler = debounce(this._selectProduct, 500); // Wait for the augmented reality scene to activate.

      this._scene.on('loaded', () => {
        // Listen to when a the user tries to select a product.
        this._selectButton.addEventListener('click', selectHandler);

        this._selectButton.addEventListener('touchend', selectHandler); // Enable the button if we've also selected a product.


        if (this._shownProduct) this._selectButton.disabled = false;
      });
    };
    /**
     *  Private event hanlder for the scene ending.
     */

    _onSceneEnd = () => {
      // Hide the scene.
      this._scene.hide(); // Start and show the barcode scanner again.


      this._scanner.start().show();
    };
    /**
     *  Private method to load the barcode scanner.
     */

    _loadBarcodeScanner = () => {
      // Create a new barcode scanner.
      this._scanner = new BarcodeScanner(this._container); // Propagate any error event that the scanner might trigger and simplify
      // the error message.

      this._scanner.on("error", () => void this.trigger("error", "Error: could not access camera")); // Listen to when the barcode scanner reads barcodes.


      this._scanner.on('scanned', this._processBarcode); // Get the overlay of the barcode scanner, so that we can configure it here.


      const scannerOverlay = this._scanner.overlay(); // Set the app's name as the page title.


      this.pageTitle(this._texts["name"]); // Add a title to the overlay.

      scannerOverlay.add("h1", {
        text: this._texts["scanning-title"],
        location: "top"
      }); // Add an instruction to the overlay.

      scannerOverlay.add("p", {
        text: this._texts["scanning-description"],
        location: "top"
      }); // Add a paragraph for displaying the scanned product to the user.

      this._productDisplay = scannerOverlay.add("p", {
        // We want to clearly show the user when we scan products.
        animated: true
      }); // Add a select button to the overlay.

      this._selectButton = scannerOverlay.add("button", {
        text: this._texts["scanning-button"] || "Select"
      }); // Disable the select button by default.

      this._selectButton.disabled = true;
    };
    /**
      *  Private method for selecting a product.
      *  @param  {Event}     event
      */

    _selectProduct = event => {
      // If we do have a product, we need to immediately stop and hide the
      // scanner.
      this._scanner.stop().hide(); // Start and show the augmented reality session instead.


      this._scene.select(this._shownProduct);
    };
    /**
      *  Private method for processing a scanned barcode.
      *  @param  {object}      data      Update object.
      *    @property {integer}   code      Product barcode.
      */

    _processBarcode = data => {
      // If we cannot recognize this product, we can't do anything.
      if (!(data.code in this._products)) return; // No need to process if we're already showing this product.

      if (this._shownProduct && data.code == this._shownProduct.barcode) return; // Update the shown product.

      this._shownProduct = this._products[data.code]; // Show the user the product name of the selected product. We want to remove
      // the text first and reset it a moment later to trigger the animation
      // effect.

      this._productDisplay.textContent = '';
      setTimeout(() => {
        this._productDisplay.textContent = this._shownProduct.name;
      }, 200); // Enable the button if the scene is also ready..

      if (this._scene.active()) this._selectButton.disabled = false;
    };
    /**
     *  Private method to load and store all products.
     *  @param    {string}    path        Path that identifies the app.
     */

    _loadProducts = path => {
      // Request all products. Store the resulting promise for cleanup purposes.
      this._productsPromise = this._request.get('/app/' + path + '/products') // Propagate errors.
      .catch(error => void this.trigger('error', error)) // Wait for the HTTP response.
      .then(response => {
        // Get access to the JSON object.
        if (response) return response.json().then(products => {
          // Loop through all products and add the name and model to our product
          // dictionary, using the barcode as the key.
          for (const product of products) this._products[product.barcode] = product;
        });
      });
    };
    /**
     *  Private method to load and store all texts that we need for this
     *  representation.
     *  @param    {string}    path        Path that identifies the app.
     */

    _loadTexts = path => {
      // Request the app data. It should contain all the texts we need.
      this._textsPromise = this._request.get('/app/' + path) // Propagate errors.
      .catch(error => void this.trigger('error', error));
    };
    /**
     *  Method to show this element.
     *  @returns  {Representation}
     */

    show() {
      // Make sure we're in fullscreen mode.
      this._enableFullscreen(); // Use the BaseElement's show method to actually show this widget.


      super.show(); // Allow chaining.

      return this;
    }
    /**
     *  Method to hide this element.
     *  @returns  {Representation}
     */


    hide() {
      // Make sure we exit fullscreen mode.
      this._disableFullscreen(); // Use the BaseElement's hide method to actually hide this widget.


      super.hide(); // Allow chaining.

      return this;
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Immediately hide this widget before we start removing it.
      this.hide(); // Stop listening for the scene to end.

      if (this._scene) this._scene.off("end", this._onSceneEnd); // Remove all classes that we've initialized.

      if (this._scanner) this._scanner.remove();
      if (this._scene) this._scene.remove();
      if (this._request) this._request.remove();
      if (this._scriptLoader) this._scriptLoader.remove(); // Remove all references to DOM elements.

      if (this._productDisplay) this._productDisplay.remove();
      if (this._selectButton) this._selectButton.remove(); // Remove all objects.

      if (this._productsPromise) this._productsPromise.then(() => {
        // It does not make sense to remove the products before they're loaded.
        delete this._products; // Remove the promise as well.

        this._productsPromise = null;
      });
      if (this._shownProduct) delete this._shownProduct; // Call the BaseElement's remove function.

      super.remove();
    }

  } // Export the Representation class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the App class component that can be used to load single
   *  product preview app.
   *
   *  @event      error         Triggered when the representation widgets throws
   *                            an error.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class App extends BaseElement {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      Container to which this component will
     *                                    be added.
     *  @param    {array}     options     Parameters.
     *    @property {string}    appPath     The path that identifies the app that
     *                                      we should shown.
     */

    constructor(parent, options = {}) {
      // Call the base class constructor first.
      super(); // Create a container for this component.

      this._container = document.createElement("div");

      this._container.classList.add("app"); // Create a new representation object that allows a user to scan a product
      // and view a representation for that product in an augmented reality scene.


      this._representation = new Representation(this._container, options); // Propagate errors.

      this._representation.on("error", error => void this.trigger("error", error)); // Add the new element to the parent container.


      parent.appendChild(this._container);
    }
    /**
     *  Method to show this element.
     *  @returns  {App}
     */


    show() {
      // Make sure we enable showing the representation.
      this._representation.show(); // Use the BaseElement's show method to actually show this widget.


      super.show(); // Allow chaining.

      return this;
    }
    /**
     *  Method to hide this element.
     *  @returns  {App}
     */


    hide() {
      // Make sure we disable showing the representation.
      this._representation.hide(); // Use the BaseElement's hide method to actually hide this widget.


      super.hide(); // Allow chaining.

      return this;
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Remove the Representation object.
      this._representation.remove(); // Call the BaseElement's remove function.


      super.remove();
    }

  } // Export the App class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Confirmation class that can be used to create an
   *  overlay over the entire page to request the user to confirm something before
   *  proceeding.
   *
   *  Note that because this widget attaches to the entire page, it does not
   *  require the parent parameter that most widgets use.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Confirmation extends BaseElement {
    /**
     *  A private variable reference to the message element.
     *  @var    {Element}
     */
    _message = null;
    /**
     *  A private variable reference to the buttons container.
     *  @var    {Element}
     */

    _buttonContainer = null;
    /**
     *  A private array that keeps track of our buttons.
     *  @var    {array}
     */

    _buttons = [];
    /**
     *  Class constructor.
     *  @param    {Object}    options   The optional parameters.
     *    @property {string}    title         Title to display to the user.
     *    @property {string}    description   Description to display to the user.
     */

    constructor(options = {}) {
      // Call the base class constructor.
      super(); // Create a container for the widget. This will act as the backdrop.

      this._container = document.createElement("div");

      this._container.classList.add("confirmation"); // Create a separate container for the message.


      this._message = document.createElement("div");

      this._message.classList.add("message");

      this._container.appendChild(this._message); // Create a title element if requested.


      if (options.title) {
        const title = document.createElement("h1");
        title.textContent = options.title;

        this._message.appendChild(title);
      } // Create a description element if requested.


      if (options.description) {
        const description = document.createElement("p");
        description.textContent = options.description;

        this._message.appendChild(description);
      } // Add the confirmation to the body of the page.


      document.body.appendChild(this._container);
    }
    /**
     *  Method for add a button to the card.
     *  @param    {object}    options       Button options.
     *  @returns  {Button}
     */


    addButton = options => {
      // If there is no buttons container yet, we should first create one.
      if (!this._buttonContainer) {
        // Create a buttons container and add it to the main container.
        this._buttonContainer = document.createElement("div");

        this._buttonContainer.classList.add("buttons");

        this._message.appendChild(this._buttonContainer);
      } // Create the new button.


      const button = new Button(this._buttonContainer, options); // Add it to our array of buttons.

      this._buttons.push(button); // Expose the button.


      return button;
    };
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */

    remove() {
      // Remove all class objects we've created.
      if (this._buttons) for (const button of this._buttons) button.remove(); // Remove DOM elements.

      if (this._message) this._message.remove();
      if (this._buttonContainer) this._buttonContainer.remove(); // Reset the buttons array.

      this._buttons = []; // Call the original remove method. This also removes the container.

      super.remove();
    }

  } // Export the Confirmation class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the OverviewCard class that can be used to create card
   *  components to represent an object in an overview.
   *
   *  @event      remove            Triggered when the remove button is clicked.
   *  @event      edit              Triggered when the edit button is clicked.
   *  @event      view              Triggered when the view button is clicked.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class OverviewCard extends BaseElement {
    /**
     *  A private variable reference to the title element.
     *  @var    {Title}
     */
    _title = null;
    /**
     *  A private variable reference to the description element.
     *  @var    {Element}
     */

    _description = null;
    /**
     *  A private variable reference to the buttons container.
     *  @var    {Element}
     */

    _buttonContainer = null;
    /**
     *  A private array that keeps track of our buttons.
     *  @var    {array}
     */

    _buttons = [];
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element to which the input
     *                                  element will be added.
     *  @param    {object}    options   Parameters for the card widget.
     *    @property   {string}  id            String that uniquely identifies the
     *                                        object this card represents.
     *    @property   {string}  title         Title to install on the card.
     *    @property   {string}  description   Description to install on the card.
     *    @property   {array}   buttons       An array of options for buttons to
     *                                        add to the card.
     *    @property   {boolean} removable     Should we add a remove button?
     *    @property   {boolean} editable      Should we add an edit button?
     *    @property   {boolean} viewable      Should we add a view button?
     */

    constructor(parent, options = {}) {
      // First call the constructor of the base class.
      super(); // Create a container for the card.

      this._container = document.createElement("div");

      this._container.classList.add("card"); // We always want to add the title and the description, even if they contain
      // no text.


      this.title(options.title);
      this.description(options.description); // Should we add a view button?

      if (options.viewable) {
        this.addButton({
          label: "View",
          type: "default" // Trigger an event that communicates that the user wants to view.

        }).on("click", () => void this.trigger("view", options.id));
      } // Should we add an edit button?


      if (options.editable) {
        this.addButton({
          label: "Edit",
          type: "default" // Trigger an event that communicates that the user wants to edit.

        }).on("click", () => void this.trigger("edit", options.id));
      } // Should we add a remove button?


      if (options.removable) {
        this.addButton({
          label: "Remove",
          type: "remove" // Trigger an event that communicates that the user wants to remove.

        }).on("click", () => void this._removeHandler(options.id));
      } // Install the other options.


      if (options.buttons) for (const button of options.buttons) this.addButton(button); // Add the card to the parent container.

      parent.appendChild(this._container);
    }
    /**
     *  Private method to double check with the user before triggering the remove
     *  event.
     *  @param    {string}    id          The id of the item that the user wants
     *                                    removed.
     */


    _removeHandler = id => {
      // Create a new confirmation element to ask the user to confirm their
      // choice.
      const confirmation = new Confirmation({
        title: "Are you sure you want to remove this item?",
        description: "You are about to permanently remove this item. This action is irreversible."
      }); // Add a button to confirm.

      confirmation.addButton({
        label: "Yes",
        type: "confirm"
      }).on("click", () => {
        // Remove the confirmation.
        confirmation.remove(); // Trigger the actual remove event.

        this.trigger("remove", id);
      }); // Add a button to cancel.

      confirmation.addButton({
        label: "No",
        type: "cancel"
      }).on("click", () => void confirmation.remove());
    };
    /**
     *  Method for installing or updating the card's title.
     *  @param    {string}    newTitle    The new title to install.
     *  @returns  {OverviewCard}
     */

    title = newTitle => {
      // If there is no title element yet, we should first install it.
      if (!this._title) this._title = new Title(this._container, {
        type: 'h2'
      }); // Update the title if we have one.

      if (newTitle) this._title.update(newTitle); // Allow chaining.

      return this;
    };
    /**
     *  Method for installing or updating the card's description.
     *  @param    {string}    newDescription    The new description to install.
     *  @returns  {OverviewCard}
     */

    description = newDescription => {
      // If there is no description element yet, we should first install it.
      if (!this._description) {
        // Create a description element and add it to the container.
        this._description = document.createElement("p");

        this._container.appendChild(this._description);
      } // Update the description if we have one.


      if (newDescription) this._description.textContent = newDescription; // Allow chaining.

      return this;
    };
    /**
     *  Method for add a button to the card.
     *  @param    {object}    options       Button options.
     *  @returns  {Button}
     */

    addButton = options => {
      // If there is no buttons container yet, we should first create one.
      if (!this._buttonContainer) {
        // Create a buttons container and add it to the main container.
        this._buttonContainer = document.createElement("div");

        this._buttonContainer.classList.add("buttons");

        this._container.appendChild(this._buttonContainer);
      } // Create the new button.


      const button = new Button(this._buttonContainer, options); // Add it to our array of buttons.

      this._buttons.push(button); // Expose the button.


      return button;
    };
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */

    remove() {
      // Remove all class objects we've created.
      if (this._title) this._title.remove();
      if (this._buttons) for (const button of this._buttons) button.remove(); // Remove DOM elements.

      if (this._description) this._description.remove();
      if (this._buttonContainer) this._buttonContainer.remove(); // Reset the buttons array.

      this._buttons = []; // Call the original remove method. This also removes the container.

      super.remove();
    }

  } // Export the OverviewCard class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the Overview class that can be used to create a overview
   *  element.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class Overview extends BaseElement {
    /**
     *  Private variable that stores a reference to the Title element if a
     *  title was added to the form.
     *  @var      {Title}
     */
    _title = null;
    /**
     *  Element that displays error messages.
     *  @var      {ErrorDisplay}
     */

    _errorDisplay = null;
    /**
     *  Array of all the cards that are listed in the overview.
     *  @var      {array}
     */

    _cards = [];
    /**
     *  Class constructor.
     *  @param    {Element}   parent    The parent element to which the overview
     *                                  will be added.
     *  @param    {object}    options   Optional parameters for instantiating the
     *                                  overview.
     *    @property   {array}   cards     Optional array of cards that are
     *                                    immediately added to the overview.
     *    @property   {string}  title     Optional string for a title to add to
     *                                    the overview.
     *    @property   {boolean} center    Should this overview be centered in the
     *                                    parent element?
     *                                    Default: false.
     */

    constructor(parent, options = {}) {
      // Call the parent class's constructor.
      super(); // Create a container for the overview.

      this._container = document.createElement("div");

      this._container.classList.add("overview"); // Add the title if requested.


      if (options.title) this.title(options.title); // Add an ErrorDisplay under the main title.

      this._errorDisplay = new ErrorDisplay(this._container); // Add the center class to the overview if requested.

      if (options.center) this._container.classList.add("center"); // Add all provided cards to the overview.

      if (options.cards) for (const card of options.cards) this.addCard(card); // Add the overview to the parent element.

      parent.appendChild(this._container);
    }
    /**
     *  Method for adding or update the title.
     *  @param    {string}    newTitle  Optional string for the title text. When
     *                                  no argument or an empty string is
     *                                  provided, the title will be removed.
     *  @returns  {Form}
     */


    title = newTitle => {
      // Do we already have a title component?
      if (this._title) {
        // Was a new title provided? Then we want to update the title component.
        if (newTitle) this._title.update(newTitle); // Was no new title provided? Then we can remove the title component.
        else this._title.remove(); // Is there no title component yet?
      } else {
        // If a new title was provided, we should create the title component.
        if (newTitle) this._title = new Title(this._container, {
          title: newTitle
        });
      } // Use the overview's title as the page title.


      document.getElementsByTagName("title")[0].textContent = newTitle; // Allow chaining.

      return this;
    };
    /**
     *  Method for adding a card element to the overview.
     *  @param    {object}    options   Optional parameters for the element that
     *                                  is added to the overview.
     *    @property   {string}  id            String that uniquely identifies the
     *                                        object this card represents.
     *    @property   {string}  title         Title to install on the card.
     *    @property   {string}  description   Description to install on the card.
     *    @property   {array}   buttons       An array of options for buttons to
     *                                        add to the card.
     *    @property   {boolean} removable     Should we add a remove button?
     *    @property   {boolean} editable      Should we add an edit button?
     *    @property   {boolean} viewable      Should we add a view button?
     *  @returns  {OverviewCard}
     */

    addCard = (options = {}) => {
      // Create a card element.
      const card = new OverviewCard(this._container, options); // Add the card to the array.

      this._cards.push(card); // Propagate all of the card's events.


      card.bubbleTo(this); // Expose the card object.

      return card;
    };
    /**
     *  Method for showing errors.
     *  @param    {string|Error}      error   Error message.
     *  @returns  {Overview}
     */

    showError = error => {
      // If this is an Error object, we should extract the error message first.
      const message = error instanceof Error ? error.message : error; // Clear the error display to show the new error.

      this._errorDisplay.clear().add(message); // Allow chaining.


      return this;
    };
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */

    remove() {
      // Remove class objects we used.
      if (this._title) this._title.remove();
      if (this._cards) for (const card of this._cards) card.remove(); // Remove all references.

      this._title = null;
      this._cards = []; // Call the remove function for the base class. This will also remove the
      // container.

      super.remove();
    }

  } // Export the Overview class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the AppList class component that can be used to load
   *  overview of created apps.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class AppList extends BaseElement {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  Private variable that stores a reference to the Overview element.
     *  @var      {Overview}
     */

    _overview = null;
    /**
     *  Reference to the request object.
     *  @var      {Request}
     */

    _request = null;
    /**
     *  Reference to the API request for the apps.
     *  @var      {Promise}
     */

    _requestPromise = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      Container to which this component will
     *                                    be added.
     */

    constructor(parent) {
      // Call the base class constructor first.
      super(); // Create a container for this component.

      this._container = document.createElement("div");

      this._container.classList.add("applist", "component"); // Create a new request object.


      this._request = new Request(); // Determine the overviews's title.

      const title = "App overview"; // Use the overview's title as the page title.

      this.pageTitle(title); // Create a app overview.

      this._overview = new Overview(this._container, {
        title,
        center: true
      }); // First, request a list of all apps. Store the promise.

      this._requestPromise = this._request.get('/apps').catch(error => void this._overview.showError(error)).then(response => {
        // Get access to the JSON object.
        if (response) return response.json().then(apps => {
          // Use this component's error handling if an error has occurred with
          // the HTTP request.
          if (!response.ok) return this._overview.showError(apps.error); // Create a new cards object.

          const cards = {}; // Create an object to map app ids to their paths for navigation.

          const paths = {}; // Loop through all of the apps.

          for (const app of apps) {
            // Create a new card for each app.
            const card = this._overview.addCard({
              id: app._id,
              title: app.name,
              description: app.description,
              removable: true,
              editable: true,
              viewable: true
            }); // Add the card to our cards dictionary.


            cards[app._id] = card; // Remember the path for this app.

            paths[app._id] = app.path;
          } // Handle remove requests.


          this._overview.on('remove', id => {
            this._request.delete('/app/' + id).catch(error => void this._overview.showError(error)).then(response => {
              // If it was deleted from the database, we should remove it from
              // the overview as well.
              if (response.ok) cards[id].remove();
            });
          }); // Link the edit button to the edit form of the appropriate app.


          this._overview.on('edit', id => void goTo('/admin/app/' + id)); // Link the view button to the URL of the appropiate app.


          this._overview.on('view', id => void goTo('/app/' + paths[id]));
        });
      }); // Add the new element to the parent container.

      parent.appendChild(this._container);
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Remove the Overview element once the request promise has resolved.
      if (this._requestPromise) this._requestPromise.then(() => void this._overview.remove()); // Call the BaseElement's remove function.

      super.remove();
    }

  } // Export the AppList class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the AppForm class component that can be used to load
   *  a form to create a new app.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class AppForm extends BaseElement {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  Private variable that stores a reference to the Form element.
     *  @var      {Form}
     */

    _form = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      Container to which this component will
     *                                    be added.
     *  @param    {object}    options     Optional parameters.
     *    @property {string}    appId       ID that identifies an app.
     */

    constructor(parent, options = {}) {
      // Call the base class constructor first.
      super(); // Do we have the ID for a specific app?

      const params = options.appId // If so, we'll try to edit that app.
      ? {
        put: '/app/' + options.appId,
        get: '/app/' + options.appId
      } // If not, we'll create a new one.
      : {
        post: '/app'
      }; // Create a container for this component.

      this._container = document.createElement("div");

      this._container.classList.add("appform", "component"); // Determine the form's title.


      const title = options.appId ? "App configuration" : "App creation"; // Use the form's title as the page title.

      this.pageTitle(title); // Create a form for creating an app.

      this._form = new Form(this._container, {
        title,
        center: true,
        params,
        inputs: [{
          name: "name",
          options: {
            label: "Name",
            type: "text",
            tooltip: "Give your app a name. This name is also visible to users in the browser tab.",
            required: true
          }
        }, {
          name: "description",
          options: {
            label: "Description",
            type: "textarea",
            tooltip: "Give your app a description. This description is only visible to you."
          }
        }, {
          name: "path",
          options: {
            label: "Path",
            type: "text",
            tooltip: "Give your app a path. This is the last part of the URL where the app will appear. It has to be unique.",
            required: true
          }
        }, {
          name: "exit-button",
          options: {
            label: "Exit button",
            type: "text",
            tooltip: "In the augmented reality scene, an app always has a button that allows the user to exit the scene. Here you can decide the text for this button.",
            required: true
          }
        }],
        fieldsets: [{
          name: "scanning",
          options: {
            legend: "Texts in scanning mode",
            tooltip: "These are the texts that will appear when a user is scanning a product.",
            inputs: [{
              name: "title",
              options: {
                label: "Title",
                type: "text",
                tooltip: "This is the title that will appear when a user is scanning a product."
              }
            }, {
              name: "description",
              options: {
                label: "Description",
                type: "textarea",
                tooltip: "This is the description that will appear when a user is scanning a product. This is the perfect place to give the user hints for how to scan a product."
              }
            }, {
              name: "button",
              options: {
                label: "Button",
                type: "text",
                tooltip: "This is the text for the button that the user uses to select a product that they have scanned. By clicking this button, the user enters the augmented reality scene.",
                required: true
              }
            }]
          }
        }, {
          name: "placing",
          options: {
            legend: "Texts in placing mode",
            tooltip: "These are the texts that will appear when a user is detecting surfaces on which to place the 3D models.",
            inputs: [{
              name: "title",
              options: {
                label: "Title",
                type: "text",
                tooltip: "This is the title that will appear when a user is detecting surfaces on which to place the 3D models."
              }
            }, {
              name: "description",
              options: {
                label: "Description",
                type: "textarea",
                tooltip: "This is the description that will appear when a user is detecting surfaces on which to place the 3D models. This is the perfect place to give the user hints for how to detect a surface."
              }
            }, {
              name: "button",
              options: {
                label: "Button",
                type: "text",
                tooltip: "This is the text for the button that the user uses to select a surface that they have detected. By clicking this button, the user places the first 3D model.",
                required: true
              }
            }]
          }
        }],
        buttons: [{
          name: "submit",
          options: {
            label: options.appId ? "Edit app" : "Create app",
            type: "submit"
          }
        }]
      }); // When the app was stored successfully, return to the app overview.

      this._form.on("stored", () => void goTo('/admin/apps')); // Add the new element to the parent container.


      parent.appendChild(this._container);
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Remove the Form element.
      this._form.remove(); // Call the BaseElement's remove function.


      super.remove();
    }

  } // Export the AppForm class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the ModelList class component that can be used to load
   *  overview of created models.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class ModelList extends BaseElement {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  Private variable that stores a reference to the Overview element.
     *  @var      {Overview}
     */

    _overview = null;
    /**
     *  Reference to the request object.
     *  @var      {Request}
     */

    _request = null;
    /**
     *  Reference to the API request for the apps.
     *  @var      {Promise}
     */

    _requestPromise = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      Container to which this component will
     *                                    be added.
     */

    constructor(parent) {
      // Call the base class constructor first.
      super(); // Create a container for this component.

      this._container = document.createElement("div");

      this._container.classList.add("modellist", "component"); // Create a new request object.


      this._request = new Request(); // Determine the overviews's title.

      const title = "Model overview"; // Use the overview's title as the page title.

      this.pageTitle(title); // Create a model overview.

      this._overview = new Overview(this._container, {
        title,
        center: true
      }); // First, request a list of all models. Store the promise.

      this._requestPromise = this._request.get('/models').catch(error => void this._overview.showError(error)).then(response => {
        // Get access to the JSON object.
        if (response) return response.json().then(models => {
          // Use this component's error handling if an error has occurred with
          // the HTTP request.
          if (!response.ok) return this._overview.showError(models.error); // Create a new cards object.

          const cards = {}; // Loop through all of the models.

          for (const model of models) {
            // Create a new card for each model.
            const card = this._overview.addCard({
              id: model._id,
              title: model.name,
              description: model.description,
              removable: true,
              editable: true,
              viewable: false
            }); // Add the card to our cards dictionary.


            cards[model._id] = card;
          } // Handle remove requests.


          this._overview.on('remove', id => {
            this._request.delete('/model/' + id).catch(error => void this._overview.showError(error)).then(response => {
              // If it was deleted from the database, we should remove it from
              // the overview as well.
              if (response.ok) cards[id].remove();
            });
          });

          this._overview.on('edit', id => void goTo('/admin/model/' + id));
        });
      }); // Add the new element to the parent container.

      parent.appendChild(this._container);
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Remove the Overview element once the request promise has resolved.
      if (this._requestPromise) this._requestPromise.then(() => void this._overview.remove()); // Call the BaseElement's remove function.

      super.remove();
    }

  } // Export the ModelList class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the ModelForm class component that can be used to load
   *  a form to create a new model.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class ModelForm extends BaseElement {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  Private variable that stores a reference to the Form element.
     *  @var      {Form}
     */

    _form = null;
    /**
     *  Reference to the request object.
     *  @var      {Request}
     */

    _request = null;
    /**
     *  Reference to the API request for the apps.
     *  @var      {Promise}
     */

    _requestPromise = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      Container to which this component will
     *                                    be added.
     *  @param    {object}    options     Optional parameters.
     *    @property {string}    modelId       ID that identifies a model.
     */

    constructor(parent, options = {}) {
      // Call the base class constructor first.
      super(); // Create a container for this component.

      this._container = document.createElement("div");

      this._container.classList.add("modelform", "component"); // Create a new request object.


      this._request = new Request(); // Create the form.

      this._createForm(options); // Add this componenet to the parent container.


      parent.appendChild(this._container);
    }
    /**
     *  Private method to create the form and add it to the container.
     *  @param    {object}    formOptions   Optional parameters.
     *    @property {string}    modelId       ID that identifies a model.
     */


    _createForm = formOptions => {
      // Do we have the ID for a specific model?
      const params = formOptions.modelId // If so, we'll try to edit that model.
      ? {
        put: '/model/' + formOptions.modelId,
        get: '/model/' + formOptions.modelId
      } // If not, we'll create a new one.
      : {
        post: '/model'
      }; // Determine the form's title.

      const title = formOptions.modelId ? "Model configuration" : "Model creation"; // Use the form's title as the page title.

      this.pageTitle(title); // Create a form for creating an new model.

      this._form = new Form(this._container, {
        title,
        center: true,
        params,
        inputs: [{
          name: "name",
          options: {
            label: "Name",
            type: "text",
            tooltip: "Give your model a name. This name is only visible to you.",
            required: true
          }
        }, {
          name: "model",
          options: {
            label: "Upload model ...",
            accept: ".glTF,.zip,.glb",
            type: "file",
            tooltip: "Click this button to select the model to upload. This can be a single file with a .glTF or .glb extension, or a .zip directory that contains an FBX, OBJ, or GLTF model and its dependencies."
          }
        }, {
          name: "multiplier",
          options: {
            label: "Multiplier",
            type: "number",
            tooltip: "You can set a multiplier of 1 or greater. If you select 2 or more, the app will display the 3D model multiple times and try to stack them in a cube-like fashion.",
            set: 1
          }
        }, {
          name: "scale",
          options: {
            label: "Scale",
            type: "number",
            tooltip: "You can set a scaling factor for the model here. If set to 1, the app will show the model at its native size. Any values greater than 1 will increase the model's size. Values between 0 and 1 will shrink the model, and values below 0 will turn the model upside down.",
            step: "any"
          }
        }],
        fieldsets: [{
          name: "viewing",
          options: {
            legend: "Texts in viewing mode",
            tooltip: "While this model is being displayed, you can also make texts appear on the page. Here you can determine those texts.",
            inputs: [{
              name: "title",
              options: {
                label: "Title",
                type: "text",
                tooltip: "Set the title to show while this model is being displayed."
              }
            }, {
              name: "description",
              options: {
                label: "Description",
                type: "textarea",
                tooltip: "Set the description to show while this model is being displayed."
              }
            }, {
              name: "button",
              options: {
                label: "Button",
                type: "text",
                tooltip: "Set the text for the button that the user can press to see the next model. If there is no next model, the button press will return the user to the surface detection mode.",
                required: true
              }
            }]
          }
        }],
        buttons: [{
          name: "submit",
          options: {
            label: formOptions.modelId ? "Edit model" : "Create model",
            type: "submit"
          }
        }]
      }); // When the model was stored successfully, return to the model overview.

      this._form.on("stored", () => void goTo('/admin/models'));
    };
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */

    remove() {
      // Remove the Form element once the request promise has resolved.
      this._form.remove(); // Call the BaseElement's remove function.


      super.remove();
    }

  } // Export the ModelForm class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the ProductList class component that can be used to load
   *  overview of created products.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class ProductList extends BaseElement {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  Private variable that stores a reference to the Overview element.
     *  @var      {Overview}
     */

    _overview = null;
    /**
     *  Reference to the request object.
     *  @var      {Request}
     */

    _request = null;
    /**
     *  Reference to the API request for the apps.
     *  @var      {Promise}
     */

    _requestPromise = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      Container to which this component will
     *                                    be added.
     */

    constructor(parent) {
      // Call the base class constructor first.
      super(); // Create a container for this component.

      this._container = document.createElement("div");

      this._container.classList.add("productlist", "component"); // Create a new request object.


      this._request = new Request(); // Determine the overviews's title.

      const title = "Product overview"; // Use the overview's title as the page title.

      this.pageTitle(title); // Create a product overview.

      this._overview = new Overview(this._container, {
        title,
        center: true
      }); // First, request a list of all products. Store the promise.

      this._requestPromise = this._request.get('/products').catch(error => void this._overview.showError(error)).then(response => {
        // Get access to the JSON object.
        if (response) return response.json().then(products => {
          // Use this component's error handling if an error has occurred with
          // the HTTP request.
          if (!response.ok) return this._overview.showError(products.error); // Create a new cards object.

          const cards = {}; // Loop through all of the products.

          for (const product of products) {
            // Create a new card for each product.
            const card = this._overview.addCard({
              id: product._id,
              title: product.name,
              description: product.description,
              removable: true,
              editable: true,
              viewable: false
            }); // Add the card to our cards dictionary.


            cards[product._id] = card;
          } // Handle remove requests.


          this._overview.on('remove', id => {
            this._request.delete('/product/' + id).catch(error => void this._overview.showError(error)).then(response => {
              // If it was deleted from the database, we should remove it from
              // the overview as well.
              if (response.ok) cards[id].remove();
            });
          }); // Redirect the user to the edit form if requested.


          this._overview.on('edit', id => void goTo('/admin/product/' + id));
        });
      }); // Add the new element to the parent container.

      parent.appendChild(this._container);
    }
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */


    remove() {
      // Remove the Overview element once the request promise has resolved.
      if (this._requestPromise) this._requestPromise.then(() => void this._overview.remove()); // Call the BaseElement's remove function.

      super.remove();
    }

  } // Export the ProductList class so it can be imported elsewhere.

  // Import dependencies.
  /**
   *  The definition of the ProductForm class component that can be used to load
   *  a form to create a new product.
   *
   *  N.B. Note that variables and methods preceeded with '_' should be treated as
   *  private, even though private variables and methods are not yet supported in
   *  Javascript classes.
   */

  class ProductForm extends BaseElement {
    /**
     *  Private variable that stores a reference to the container element in the
     *  DOM.
     *  @var      {Element}
     */
    _container = null;
    /**
     *  Private variable that stores a reference to the Form element.
     *  @var      {Form}
     */

    _form = null;
    /**
     *  Reference to the Select input object for the models.
     *  @var      {Select}
     */

    _modelsSelect = null;
    /**
     *  Reference to the Select input object for the products.
     *  @var      {Select}
     */

    _productsSelect = null;
    /**
     *  Reference to the request object.
     *  @var      {Request}
     */

    _request = null;
    /**
     *  Reference to the API request for the models.
     *  @var      {Promise}
     */

    _modelsRequest = null;
    /**
     *  Reference to the API request for the apps.
     *  @var      {Promise}
     */

    _appsRequest = null;
    /**
     *  Class constructor.
     *  @param    {Element}   parent      Container to which this component will
     *                                    be added.
     *  @param    {object}    formOptions     Optional parameters.
     *    @property {string}    productId       ID that identifies a product.
     */

    constructor(parent, options = {}) {
      // Call the base class constructor first.
      super(); // Create a container for this component.

      this._container = document.createElement("div");

      this._container.classList.add("productform", "component"); // Create a new request object.


      this._request = new Request(); // Create the form.

      this._createForm(options); // Add the new element to the parent container.


      parent.appendChild(this._container); // First, request a list of all models. Store the promise.

      this._modelsRequest = this._request.get('/models').catch(error => void this._form.showError(error)).then(response => {
        // Get access to the JSON object.
        if (response) response.json().then(models => {
          // Use this component's error handling if an error has occurred with
          // the HTTP request.
          if (!response.ok) return this._form.showError(models.error); // Loop through all of the models.

          for (const model of models) {
            // Add the model to the select input.
            this._modelsSelect.addOption(model._id, model.name);
          }
        });
      }); // Secondlly, request a list of all apps. Store the promise.

      this._appsRequest = this._request.get('/apps').catch(error => void this._form.showError(error)).then(response => {
        // Get access to the JSON object.
        if (response) response.json().then(apps => {
          // Use this component's error handling if an error has occurred with
          // the HTTP request.
          if (!response.ok) return this._form.showError(apps.error); // Loop through all of the apps.

          for (const app of apps) {
            // Add the app to the select input.
            this._appsSelect.addOption(app._id, app.name);
          }
        });
      });
    }
    /**
     *  Private method to create the form and add it to the container.
     *  @param    {object}    formOptions     Optional parameters.
     *    @property {string}    productId       ID that identifies a product.
     */


    _createForm = formOptions => {
      // Do we have the ID for a specific product?
      const params = formOptions.productId // If so, we'll try to edit that product.
      ? {
        put: '/product/' + formOptions.productId,
        get: '/product/' + formOptions.productId
      } // If not, we'll create a new one.
      : {
        post: '/product'
      }; // Determine the form's title.

      const title = formOptions.productId ? "Product configuration" : "Product creation"; // Use the form's title as the page title.

      this.pageTitle(title); // Create a form for creating an new product.

      this._form = new Form(this._container, {
        title,
        center: true,
        params,
        inputs: [{
          name: "name",
          options: {
            label: "Name",
            type: "text",
            tooltip: "Give your product a name. This name is also visible to users who scan this product.",
            required: true
          }
        }, {
          name: "barcode",
          options: {
            label: "Barcode",
            type: "number",
            tooltip: "Enter the product's barcode. It is important that this is entered accurately, or the user won't be able to scan the product!",
            required: true
          }
        }]
      }); // Create the select input for the models seperately so that we can save a
      // reference that we can load the options to later on.

      this._modelsSelect = this._form.addInput("models", {
        label: "Models",
        placeholder: "Select model ...",
        tooltip: "Select the models to display for this product. You can select multiple models per product. They will appear to the user in the order that is displayed here; the first model you add will be the first model the user sees.",
        type: "multiselect"
      }); // Create the select input for the apps seperately so that we can save a
      // reference that we can load the options to later on.

      this._appsSelect = this._form.addInput("app", {
        placeholder: "Select app ..",
        tooltip: "Select the app to which to add this product. You cannot add more than one product to an app with the same barcode.",
        type: "select"
      }); // We want to add the button at the bottom of the form.

      this._form.addButton("submit", {
        label: formOptions.productId ? "Edit product" : "Create product",
        type: "submit"
      }); // When the product was stored successfully, return to the product overview.


      this._form.on("stored", () => void goTo('/admin/products'));
    };
    /**
     *  Method to remove this object and clean up after itself. We have to use
     *  non-arrow function or we'd lose the super context.
     */

    remove() {
      // Remove the Form element once the all requests have been resolved.
      Promise.all([this._modelsRequest, this._appsRequest]).then(() => {
        this._form.remove();
      }); // Call the BaseElement's remove function.

      super.remove();
    }

  } // Export the ProductForm class so it can be imported elsewhere.

  /**
   *  Main file for the augmented reality admin interface. This is the master file
   *  that arranges routing for the login and the different form pages.
   */
  /**
   *  This is the container for the entire application. Because we want to use the
   *  full page, we can simply use the document's body element.
   *  @var      {Element}
   */

  const container = document.body;
  /**
   *  Create a new menu to help admin users navigate.
   *  @var    {Menu}
   */

  new Menu(container, {
    // Show the menu only on the admin pages.
    pages: ['/admin'],
    // Wen want to help the user easily navigate to all overviews, and to the
    // profile page to edit his account information.
    navigation: new Map([['Apps', '/admin/apps'], ['Products', '/admin/products'], ['Models', '/admin/models'], ['Profile', '/admin/profile'], ['Log out', '/logout']]),
    // Add quick shortcuts to allow the users to quickly create new objects.
    shortcuts: new Map([['Add app', '/admin/app/new'], ['Add product', '/admin/product/new'], ['Add model', '/admin/model/new']])
  });
  /**
   *  Create a new View instance to show components. The View will automatically
   *  clean up previously installed components if we install a new one so that we
   *  always have one active.
   *  @var      {View}
   */

  const view = new View(container, {
    // We want to limit the amount of components we cache to limit memory usage,
    // but we do want to cache some components to limit the number of requests
    // that are made and the amount of Javascript computation that needs to be
    // done.
    cacheSize: 15,
    // By default, we want to install an apology that indicates that we're loading
    // the next component through the router.
    Widget: Apology,
    params: ["Loading..."] // Listen for any unrecoverable errors and show the message to the user.

  }).on("error", error => void view.install(Apology, error));
  /**
   *  Create a new Router instance. The Router will listen for any changes to the
   *  URL, whether manually by the user, or programmatically with the goTo()
   *  function. It will communicate those changes via the "navigate" event.
   *  @var      {Router}
   */

  new Router(new Map([// This route will serve all apps.
  ['/app/:appPath', App], // These routes will serve the admin interface.
  ['/', Login], ['/login', Login], ['/logout', Logout], ['/register', Registration], ['/admin', AppList], ['/admin/apps', AppList], ['/admin/app/new', AppForm], ['/admin/app/:appId', AppForm], ['/admin/models', ModelList], ['/admin/model/new', ModelForm], ['/admin/model/:modelId', ModelForm], ['/admin/products', ProductList], ['/admin/product/new', ProductForm], ['/admin/product/:productId', ProductForm], ['/admin/profile', PasswordForm]]), {
    // Protect the admin routes.
    protected: ['/admin']
  }) // Make sure that we pass on any navigation requests to the View widget.
  .on("navigate", page => void view.install(page.component, page.options)) // Show an apology if the route could not be found.
  .on("not-found", () => void view.install(Apology, "This page could not be found.", {
    text: 'Visit login',
    location: '/login'
  })) // Show an apology if the user is trying to access a protected route they are
  // not allowed to access.
  .on("not-allowed", () => void view.install(Apology, "You are not allowed to view this page.", {
    text: 'Visit login',
    location: '/login'
  })) // Make sure we initially honor the current URL request.
  .navigateToCurrent();

}());
