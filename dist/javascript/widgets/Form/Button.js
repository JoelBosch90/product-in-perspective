// Import dependencies.
import { FormElement } from "/javascript/widgets/Form/Element.js";
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

class FormButton extends FormElement {
  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element to which the button
   *                                  element will be added.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the form.
   *    @property   {string}  name      Registration name of the input. This is
   *                                    also used in the API call and should
   *                                    uniquely identify the input.
   *    @property   {string}  type      This is the type of the button that is
   *                                    added.
   *                                    Default: 'text'
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   */
  constructor(parent, options = {}) {
    // First call the constructor of the base class.
    super(); // Create a container for the button element.

    this._container = document.createElement("button");
    if (options.type) this._container.setAttribute("type", options.type);
    if (options.label) this._container.textContent = options.label; // Add the event listener to the button.

    this._container.addEventListener("click", this._onClick); // Add the button element to the parent element.


    parent.appendChild(this._container);
  }
  /**
   *  Definition of an event handler for button clicks.
   *  @param    {Event}     event     The normal HTML click event.
   */


  _onClick = event => {
    // We don't ever want to reload a page to submit a form. So we prevent the
    // default behaviour of all buttons in our forms.
    event.preventDefault(); // Trigger the event handler to bubble this event.

    this.trigger("click", event);
  };
  /**
   *  Method to remove this object and clean up after itself.
   *  @returns  {FormButton}
   */

  remove = () => {
    // Remove the event listener first.
    this._container.removeEventListener("click", this._onClick); // Then let the parent element clean up the container.


    super.remove(); // Allow chaining.

    return this;
  };
} // Export the FormButton class so it can be imported elsewhere.


export { FormButton };