// Import dependencies
import { EventHandler } from "/javascript/tools/EventHandler.js";

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
    super();

    // Store a reference to the head element of the page.
    this._head = document.getElementsByTagName('head')[0];

    // Load all scripts.
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
    const path = script.slug;

    // Move the script element to our map of loaded scripts.
    this._loading.delete(path);
    this._loaded.set(path, script);

    // Trigger a loaded event for loading this specific script.
    this.trigger("loaded", { path: path, element: script });

    // Trigger the loaded-all event if that all scripts have loaded.
    if (!this._toLoad.length && !this._loading.size && !this._failed.size) this.trigger("loaded-all");
  }

  /**
   *  Method for handling errors.
   *  @param    {Event}     event     Event object describing the error that
   *                                  occurred.
   */
  _errorHandler = event => {

    // Get the script element and the path to the Javascript library from the
    // event.
    const script = event.target;
    const path = script.slug;

    // Move the script tag to our map of failed scripts.
    this._loading.delete(path);
    this._failed.set(path, script);

    // Trigger a failed event with information about this specific script.
    this.trigger("failed", { path: path, tag: script });
  }

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
    this._toLoad = paths;

    // Load all paths.
    for (const path of paths) this.load(path);

    // Allow chaining.
    return this;
  }

  /**
   *  Method to dynamically load an internal Javascript library.
   *  @param    {string}      path    Path to a Javascript library.
   *  @returns  {ScriptLoader}
   */
  load = path => {

    // We shouldn't load libraries twice.
    if (this._loading.has(path) || this._loaded.has(path)) return;

    // If we've failed loading this script before, we'll try again fresh.
    if (this._failed.has(path)) this._failed.delete(path);

    // Check if this script was already loaded before.
    const alreadyLoaded = this._alreadyLoaded(path);

    // If so, we want to use that script tag to trigger the events. We should
    // not attempt to load it again as that may trigger errors.
    if (alreadyLoaded) {

      // Remove this path from the toLoad array.
      this._toLoad = this._toLoad.filter(listed => path != listed);

      // Trigger the appropriate loaded events.
      this._loadHandler({ target: alreadyLoaded });

      // We do not need to do anything else. Allow chaining.
      return this;
    };

    // Create the script element. We'll load the new script by adding a script
    // tag to the DOM. This is a safe way to load a new script.
    const script = document.createElement('script');
    script.type = 'text/javascript';

    // Install the handlers.
    script.onerror = this._errorHandler;
    script.onload = this._loadHandler;

    // Move the script to our loading list.
    this._toLoad = this._toLoad.filter(listed => path != listed);
    this._loading.set(path, script);

    // Add the script to the head of the page and add the script source so it
    // can start loading the script.
    this._head.appendChild(script);
    script.src = path;

    // When setting the src attribute on the HTMLScriptElement, the browser will
    // automatically add the current URL to the script. This is great for
    // loading the script, but makes this attribute hard to use as our key. To
    // make sure we have a recognizable path to use, we can store the string in
    // a separate variable on the script element that we call 'slug'. This time
    // the browser will not add the current URL to the path, allowing us to
    // easily use it as a key.
    script.slug = path;

    // Allow chaining.
    return this;
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Reset the list of items we have to load.
    this._toLoad = [];

    // In this case, it does not make sense to remove the script tags. They
    // serve as proof that these libraries have been loaded, so it is more
    // useful to leave them in the DOM. We should still remove the reference to
    // the DOM elements so that they can be properly garbage collected if they
    // are removed from the DOM.
    this._head = null;
    this._loaded.clear();
    this._loading.clear();
    this._failed.clear();

    // Call the EventHandler's remove function.
    super.remove();
  }
}

// Export the ScriptLoader class so it can be imported elsewhere.
export { ScriptLoader };
