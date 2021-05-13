// Import dependencies
import { BaseElement } from "/javascript/widgets/BaseElement.js";
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
   *  Array for keeping track of the installed widgets.
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
   *    @property   {object}  options     The additional option parameters for
   *                                      the widget that is to be installed
   *                                      immediately.
   */

  constructor(parent, options = {}) {
    // First call the constructor of the base class.
    super(); // Store the cache size, but make sure it is at least 1.

    this._cacheSize = options.cacheSize > 1 ? options.cacheSize : 1; // Create a container for the select element.

    this._container = document.createElement("div");

    this._container.classList.add("view"); // If a widget was passed, install it immediately.


    if (options.Widget) this.install(options.Widget, options.options); // Add the input element to the parent element.

    parent.appendChild(this._container);
  }
  /**
   *  Method for installing a new widget.
   *  @param   {Class}   Widget     The widget that will be installed as the
   *                                active widget. It should extend the
   *                                BaseElement class.
   *  @param   {object}  params     The additional options that will be passed
   *                                to the widget. These will be ignore if a
   *                                widget with this class was already
   *                                installed.
   *  @returns {View}
   */


  install(Widget, ...params) {
    // Check if we've installed a widget with this class before.
    if (!this._widgets.has(Widget)) {
      // If not, create it.
      const widget = new Widget(this._container, ...params); // Make sure we propagate all events that this widget triggers.

      widget.bubbleTo(this); // And add it to the Map, using the class as a key.

      this._widgets.set(Widget, widget); // If we have more widgets that the maximum cache size allows, clear one
      // widget.


      if (this._widgets.size > this._cacheSize) this._cullWidget();
    } // Now activate the the requested widget.


    this._activate(Widget); // Allow chaining.


    return this;
  }
  /**
   *  Private method for exposing the currently active widget.
   *  @returns  {BaseElement}
   */


  _activeWidget() {
    // Return the last widget in the map.
    return Array.from(this._widgets).pop()[1];
  }
  /**
   *  Private method for activating a widget.
   *  @param   {Class}    widget    The widget that will be activated.
   */


  _activate(Widget) {
    // Cannot
    if (!Widget) return; // Hide the widget that is currently active.

    this._activeWidget().hide(); // First, get the instantiated widget.


    const widget = this._widgets.get(Widget); // Now remove the previous entry for this widget from the Map.


    this._widgets.delete(Widget); // And add it as the newest one. This will make sure that the widgets that
    // are not used are the first to be removed if the cache size is exceeded.


    this._widgets.set(Widget, widget); // Now show the newly activated widget.


    widget.show();
  }
  /**
   *  Private method that removes the the widget that has been inactive the
   *  longest.
   */


  _cullWidget() {
    // Get the first widget and its class constructor in the map.
    const [Class, widget] = Array.from(this._widgets)[0]; // Use the class constructor to remove the widget from the map.

    this._widgets.delete(Class); // Now clean up the widget itself.


    widget.remove();
  }
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */


  remove() {
    // Remove all installed widgets.
    for (const [Class, widget] of this._widgets) widget.remove(); // Clear the map.


    this._widgets.clear(); // Call the BaseElement's remove function.


    super.remove();
  }

} // Export the View class so it can be imported elsewhere.


export { View };