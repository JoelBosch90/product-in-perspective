// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { FormInput } from "/javascript/widgets/Form/Input.js";
import { Button } from "/javascript/widgets/Button.js";
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
   *    @property   {array}   buttons   Optional array of buttons that are
   *                                    immediately added to the fieldset.
   *    @property   {array}   inputs    Optional array of inputs that are
   *                                    immediately added to the fieldset.
   */

  constructor(parent, options = {}) {
    // First call the constructor of the base class.
    super(); // Create a container for the input element.

    this._container = document.createElement("fieldset"); // Create the legend element if a text is provided.

    if (options.legend) this.legend(options.legend); // We want to prefix the names of all inputs, fieldsets and buttons in this
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

        this._container.appendChild(this._legend);
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

    const button = new Button(this._container, Object.assign({}, options, {
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


export { FormFieldset };