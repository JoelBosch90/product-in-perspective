// Import dependencies.
import { FormElement } from "/javascript/widgets/Form/Element.js";
/**
 *  The definition of the Fieldset class that can be used to create fieldset
 *  elements for in a form.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class FormFieldset extends FormElement {
  /**
   *  Reference to the legend element.
   *  @var      {Legend}
   */
  _legend = null;
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
   *  Class constructor.
   *  @param    {Element}   parent    The parent element to which the fieldset
   *                                  will be added.
   *  @param    {object}    options   Optional parameters for the fieldset that
   *                                  is added to the form.
   *    @property   {string}  legend    This is the main label that is added to
   *                                    the fieldset.
   *    @property   {array}   buttons   Optional array of buttons that are
   *                                    immediately added to the fieldset.
   *    @property   {array}   inputs    Optional array of inputs that are
   *                                    immediately added to the fieldset.
   */

  constructor(parent, options = {}) {
    // First call the constructor of the base class.
    super(); // Create a container for the input element.

    this._container = document.createElement("fieldset"); // Create the legend element if a text is provided.

    if (options.legend) this.legend(options.legend); // Add all provided buttons and inputs to the form.

    if (options.inputs) for (const input of options.inputs) this.addInput(input.name, input.options);
    if (options.buttons) for (const button of options.buttons) this.addButton(button.name, button.options);
    if (options.fieldsets) for (const fieldset of options.fieldsets) this.addFieldset(fieldset.name, fieldset.options); // Add the input element to the parent element.

    parent.appendChild(this._container);
  }
  /**
   *  Method for adding or updating the legend element.
   *  @param    {string}    newLabel  Optional string for the legend text. When
   *                                  no argument or an empty string is
   *                                  provided, the legend will be removed.
   *  @returns  {FormFieldset}
   */


  legend(newLabel) {
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

        this._container.appendChild(this._legend);
      }
    } // Allow chaining.


    return this;
  }
  /**
   *  Method for adding an input element to the form.
   *  @param    {string}    name      Registration name of the input. This is
   *                                  also used in the API call and should
   *                                  uniquely identify the input.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the form.
   *    @property   {string}  type      This is the type of input element.
   *                                    Default: 'text'
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   *  @returns  {FormInput}
   */


  addInput(name, options = {}) {
    // Create an input element.
    const input = new FormInput(this._container, options); // If there is already an input element with this name. If so, we need to
    // remove that first.

    if (this._inputs[name]) this._inputs[name].remove(); // Add the input element to the list of inputs.

    this._inputs[name] = input; // Expose the input object.

    return input;
  }
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
   *  @returns  {FormFieldset}
   */


  addFieldset(name, options = {}) {
    // Create a fieldset element.
    const fieldset = new FormFieldset(this._container, options); // If there is already an fieldset element with this name. If so, we need to
    // remove that first.

    if (this._fieldsets[name]) this._fieldsets[name].remove(); // Add the fieldset element to the list of fieldsets.

    this._fieldsets[name] = fieldset; // Expose the fieldset object.

    return fieldset;
  }
  /**
   *  Method for adding a button to the form.
   *  @param    {string}    name      Registration name of the button.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the form.
   *    @property   {string}  element   This is the name of the element that is
   *                                    added.
   *                                    Default: 'text'
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   *  @returns  {FormButton}
   */


  addButton(name, options = {}) {
    // Create an button element.
    const button = new FormButton(this._container, options); // If there is already an button element with this name. If so, we need to
    // remove that first.

    if (this._buttons[name]) this._buttons[name].remove(); // Add the button element to the list of buttons.

    this._buttons[name] = button; // Expose the button object.

    return button;
  }
  /**
   *  We need to append the remove method to clean up other elements we've
   *  added.
   *  @returns  {FormFieldset}
   */


  remove() {
    // Remove all DOM elements we've added.
    if (this._legend) this._legend.remove(); // Remove all classes we've added.

    for (const input in this._inputs) input.remove();

    for (const fieldset in this._fieldsets) fieldset.remove();

    for (const button in this._buttons) button.remove(); // Call the original remove method. This should also remove the container.


    super.remove(); // Allow chaining.

    return this;
  }

} // Export the FormFieldset class so it can be imported elsewhere.


export { FormFieldset };