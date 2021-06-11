// Import dependencies.
import { BaseElement } from "../BaseElement.js";
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
    if (options.multiple) this._container.setAttribute("multiple", true); // Should we set a placeholder?

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


export { FormSelect };