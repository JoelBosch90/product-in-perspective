// Import dependencies.
import { BaseElement } from "../widgets/BaseElement.js";
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
   *    @property   {array}  classes    Optional array of classes to install on
   *                                    the button.
   */
  constructor(parent, options = {}) {
    // First call the constructor of the base class.
    super(); // Create a container for the button element.

    this._container = document.createElement("button");
    if (options.type) this._container.setAttribute("type", options.type);
    if (options.label) this._container.textContent = options.label;
    if (options.disabled) this.disabled(options.disabled);
    if (options.classes) for (const newClass of options.classes) this.addClass(newClass); // Add the event listener to the button.

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
   *  Method to add a class to the button.
   *  @param    {string}    newClass  The new class to add to the button.
   *  @returns  {Button}
   */

  addClass = newClass => {
    // Add the class to the button.
    this._container.classList.add(newClass); // Allow chaining.


    return this;
  };
  /**
   *  Method to remove a class to the button.
   *  @param    {string}    newClass  The new class to remove to the button.
   *  @returns  {Button}
   */

  removeClass = newClass => {
    // Remove the class to the button.
    this._container.classList.remove(newClass); // Allow chaining.


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


export { Button };