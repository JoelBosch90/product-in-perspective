// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { FormInput } from "/javascript/widgets/Form/Input.js";
import { FormFieldset } from "/javascript/widgets/Form/Fieldset.js";
import { Button } from "/javascript/widgets/Button.js";
import { Title } from "/javascript/widgets/Title.js";
/**
 *  The definition of the Form class that can be used to create a form element.
 *
 *  @event      submit        Triggered when the user opts to submit the form.
 *  @event      stored        Triggered when the API call has succeeded.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class Form extends BaseElement {
  /**
   *  Private variable that stores a reference to the Title element if a
   *  title was added to the form.
   *  @var      {Title}
   */
  _title = null;
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
   *  @param    {Element}   parent    The parent element to which the form will
   *                                  be added.
   *  @param    {object}    options   Optional parameters for instantiating the
   *                                  form.
   *    @property   {array}   buttons   Optional array of buttons that are
   *                                    immediately added to the form.
   *    @property   {array}   inputs    Optional array of inputs that are
   *                                    immediately added to the form.
   *    @property   {string}  title     Optional string for a title to add to
   *                                    the form.
   *    @property   {boolean} center    Should this form be centered in the
   *                                    parent element?
   *                                    Default: false.
   */

  constructor(parent, options = {}) {
    // Call the parent class's constructor.
    super(); // Create a container for the form.

    this._container = document.createElement("form"); // Add the title if requested.

    if (options.title) this.title(options.title); // Add the center class to the form if requested.

    if (options.center) this._container.classList.add("center"); // Add all provided buttons and inputs to the form.

    if (options.inputs) for (const input of options.inputs) this.addInput(input.name, input.options);
    if (options.fieldsets) for (const fieldset of options.fieldsets) this.addFieldset(fieldset.name, fieldset.options);
    if (options.buttons) for (const button of options.buttons) this.addButton(button.name, button.options); // Add the form to the parent element.

    parent.appendChild(this._container);
  }
  /**
   *  Method for adding or update the title.
   *  @param    {string}    newTitle  Optional string for the title text. When
   *                                  no argument or an empty string is
   *                                  provided, the title will be removed.
   *  @returns  {Form}
   */


  title = newTitle => {
    // Do we already have a title component?
    if (this._title) {
      // Was a new title provided? Then we want to update the title component.
      if (newTitle) this._title.update(newTitle); // Was no new title provided? Then we can remove the title component.
      else this._title.remove(); // Is there no title component yet?
    } else {
      // If a new title was provided, we should create the title component.
      if (newTitle) this._title = new Title(this._container, {
        title: newTitle
      });
    } // Allow chaining.


    return this;
  };
  /**
   *  Method for adding an input element to the form.
   *  @param    {string}    name      Registration name of the input. This is
   *                                  also used in the API call and should
   *                                  uniquely identify the input.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the form.
   *    @property   {string}  type      This is the type of input element.
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   *  @returns  {FormInput}
   */

  addInput = (name, options = {}) => {
    // Create an input element.
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

  addFieldset = (name, options = {}) => {
    // Create a fieldset element. Also provide the name to the fieldset.
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
   *  @param    {string}    name      Registration name of the button.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the form.
   *    @property   {string}  type      This is the type of input element.
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   *  @returns  {Button}
   */

  addButton = (name, options = {}) => {
    // Create an button element.
    const button = new Button(this._container, Object.assign({}, options, {
      name
    })); // If there is already an button element with this name. If so, we need to
    // remove that first.

    if (this._buttons[name]) this._buttons[name].remove(); // Add the button element to the list of buttons.

    this._buttons[name] = button; // Expose the button object.

    return button;
  };
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */

  remove() {
    // Remove class objects we used.
    if (this._title) this._title.remove();
    if (this._inputs) for (const input in this._inputs) input.remove();
    if (this._fieldsets) for (const fieldset in this._fieldsets) fieldset.remove();
    if (this._buttons) for (const button in this._buttons) button.remove(); // Remove all references.

    this._title = null;
    this._inputs = {};
    this._fieldsets = {};
    this._buttons = {}; // Call the remove function for the base class. This will also remove the
    // container.

    super.remove();
  }

} // Export the Form class so it can be imported elsewhere.


export { Form };