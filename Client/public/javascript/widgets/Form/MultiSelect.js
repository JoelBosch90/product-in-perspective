// Import dependencies.
import { BaseElement } from "../BaseElement.js";
import { FormSelect } from "./Select.js";
import { Button } from "../Button.js";
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


export { FormMultiSelect };