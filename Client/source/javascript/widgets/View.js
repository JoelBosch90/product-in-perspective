// Import dependencies
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { equal } from "/javascript/tools/equal.js";

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
    super();

    // Store the cache size, but make sure it is at least 1.
    this._cacheSize = options.cacheSize > 1 ? options.cacheSize : 1;

    // Create a container for the select element.
    this._container = document.createElement("div");
    this._container.classList.add("view");

    // If a widget was passed, install it immediately.
    if (options.Widget) this.install(options.Widget, ...options.params);

    // Add the view container to the parent element.
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
      if (active) active.instance.hide()

      // If not, create an instance of this widget.
      const instance = new Widget(this._container, ...params);

      // Make sure we propagate all events that this widget triggers.
      instance.bubbleTo(this);

      // And add the widget and its parameters to the Map, using the class as a
      // key.
      this._widgets.set(Widget, { instance, params });

      // If we have more widgets that the maximum cache size allows, clear one
      // widget.
      if (this._widgets.size > this._cacheSize) this._cullWidget();
    }

    // Now activate the the requested widget with the requested parameters.
    this._activate(Widget, params);

    // Allow chaining.
    return this;
  }

  /**
   *  Private method for exposing the currently active widget.
   *  @returns  {BaseElement|false}
   */
  _activeWidget() {

    // Return the last widget in the map.
    if (this._widgets.size) return Array.from(this._widgets).pop()[1];

    // Return false if there is no active widget.
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
    if (!Widget) return;

    // Hide the widget that is currently active.
    this._activeWidget().instance.hide();

    // First, get the instantiated widget.
    const widget = this._widgets.get(Widget);

    // Now remove the previous entry for this widget from the Map.
    this._widgets.delete(Widget);

    // If the parameters for this widget have changed, we need to create a new
    // instance.
    if (!equal(widget.params, params)) {

      // Remember the new parameters.
      widget.params = params;

      // Remove the previous instance.
      widget.instance.remove();

      // Create the new instance of the same class.
      widget.instance = new Widget(this._container, ...params);
    }

    // And add it as the newest one. This will make sure that the widgets that
    // are not used are the first to be removed if the cache size is exceeded.
    this._widgets.set(Widget, widget);

    // Now show the newly activated widget.
    widget.instance.show();
  }

  /**
   *  Private method that removes the the widget that has been inactive the
   *  longest.
   */
  _cullWidget() {

    // Get the first widget object and its class constructor in the map.
    const [Class, widget] = Array.from(this._widgets)[0];

    // Use the class constructor to remove the widget object from the map.
    this._widgets.delete(Class);

    // Now clean up the widget itself.
    widget.instance.remove();
  }

  /**
   *  Method to clean the view of all installed widgets.
   *  @returns  {View}
   */
  clear() {

    // Remove all installed widgets.
    for (const [Class, widget] of this._widgets) widget.instance.remove();

    // Clear the map.
    this._widgets.clear();

    // Allow chaining.
    return this;
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // First clear the view of all installed widgets.
    this.clear();

    // Call the BaseElement's remove function.
    super.remove();
  }
}

// Export the View class so it can be imported elsewhere.
export { View };
