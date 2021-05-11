// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
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
   *  @param    {Element}   parent    The parent element to which the select
   *                                  will be added.
   *  @param    {object}    options   Optional parameters for the select that
   *                                  is added to the form.
   *    @property   {string}  name      Registration name of the select. This
   *                                    should uniquely identify the select.
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   *    @property   {array}   options   An array of options to add to the select
   *                                    element.
   */

  constructor(parent, options = {}) {
    // First call the constructor of the base class.
    super(); // Create a container for the select element.

    this._container = document.createElement("select");
    if (options.name) this._container.name = options.name; // Should we set a label?

    if (options.label) {
      // Add the label as a disabled option to get a placeholder value.
      const label = this.addOption(options.label); // Make sure this is the one that's selected by default.

      label.selected = true; // Make sure it cannot be selected.

      label.disabled = true; // Make sure it is hidden in the dropdown menu.

      label.hidden = true;
    } // Add all the options we get.


    if (options.options) for (const option of options.options) this.addOption(option.label, option.value); // Add the input element to the parent element.

    parent.appendChild(this._container);
  }
  /**
   *  Method for adding an option element to the select element.
   *  @property   {string}  value     This is the value of the option that is
   *                                  communicated to the API endpoint.
   *  @property   {string}  label     This is the label of the options that is
   *                                  shown to the user.
   *  @returns  {FormSelect}
   */


  addOption = (label, value) => {
    // We cannot add an option without a label.
    if (!label) return; // Create the option element.

    const option = document.createElement("option");
    option.value = value;
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
    if (this._options) for (const option in this._options) options.remove(); // Remove all references to the options.

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