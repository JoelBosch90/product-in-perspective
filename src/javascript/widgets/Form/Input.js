// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { FormSelect } from "/javascript/widgets/Form/Select.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

/**
 *  The definition of the Input class that can be used to create input elements.
 *
 *  @event      changed     @TODO
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class FormInput extends BaseElement {

  /**
   *  To link an input and a label together, we need to have a unique ID. One
   *  way to create this unique ID is through UUID.
   *  @var    {string}
   */
  _id = 'input' + uuidv4();

  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element to which the input
   *                                  element will be added.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the form.
   *    @property   {string}  name      Registration name of the input. This is
   *                                    also used in the API call and should
   *                                    uniquely identify the input.
   *    @property   {string}  type      This is the type of the input that is
   *                                    added.
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   *    @property   {array}   options   An array of options to add to the select
   *                                    element. This is only used when the
   *                                    type is 'select'.
   */
  constructor(parent, options = {}) {

    // First call the constructor of the base class.
    super();

    // Depending on the input type, we may need to create a different element.
    switch(options.type) {

      // Should we create a texarea element?
      case "textarea": this._createTextarea(parent, options); break;

      // Should we create an file upload button?
      case "file": this._createFileButton(parent, options); break;

      // Should we create a select element?
      case "select": this._createSelect(parent, options); break;

      // Otherwise, create a default input element.
      default: this._createInput(parent, options);
    }
  }

  /**
   *  Private method for creating a default input.
   *  @param    {Element}   parent    The parent element to which the input
   *                                  element will be added.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the form.
   *    @property   {string}  name      Registration name of the input. This is
   *                                    also used in the API call and should
   *                                    uniquely identify the input.
   *    @property   {string}  type      This is the type of the input that is
   *                                    added.
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   */
  _createInput = (parent, options) => {

    // Create a container for the input element.
    this._container = document.createElement("div");
    this._container.classList.add("input-field");

    // Use the label for the on hover title.
    this._container.setAttribute("title", options.label);

    // Create the input element.
    this._input = document.createElement("input");
    this._input.id = this._id;
    this._input.name = options.name;
    this._input.setAttribute("type", options.type);
    this._input.setAttribute("placeholder", options.label);

    // Create the label element.
    this._label = document.createElement("label");
    this._label.setAttribute("for", this._id);

    // Add a text element to the label.
    const labelText = document.createElement("span");
    labelText.textContent = options.label;
    this._label.appendChild(labelText);

    // Add the input and the label to the container.
    this._container.appendChild(this._input);
    this._container.appendChild(this._label);

    // Add the input element to the parent element.
    parent.appendChild(this._container);
  }

  /**
   *  Private method for creating a textarea element.
   *  @param    {Element}   parent    The parent element to which the input
   *                                  element will be added.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the form.
   *    @property   {string}  name      Registration name of the input. This is
   *                                    also used in the API call and should
   *                                    uniquely identify the input.
   *    @property   {string}  type      This is the type of the input that is
   *                                    added.
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   */
  _createTextarea = (parent, options) => {

    // Create a container for the input element.
    this._container = document.createElement("div");
    this._container.classList.add("input-field");

    // Use the label for the on hover title.
    this._container.setAttribute("title", options.label);

    // Create the input element.
    this._input = document.createElement("textarea");
    this._input.id = this._id;
    this._input.name = options.name;
    this._input.setAttribute("type", options.type);
    this._input.setAttribute("placeholder", options.label);

    // Create the label element.
    this._label = document.createElement("label");
    this._label.setAttribute("for", this._id);

    // Add a text element to the label.
    const labelText = document.createElement("span");
    labelText.textContent = options.label;
    this._label.appendChild(labelText);

    // Add the input and the label to the container.
    this._container.appendChild(this._input);
    this._container.appendChild(this._label);

    // Add the input element to the parent element.
    parent.appendChild(this._container);
  }

  /**
   *  Private method for creating a file upload button.
   *  @param    {Element}   parent    The parent element to which the input
   *                                  element will be added.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the form.
   *    @property   {string}  name      Registration name of the input. This is
   *                                    also used in the API call and should
   *                                    uniquely identify the input.
   *    @property   {string}  type      This is the type of the input that is
   *                                    added.
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   */
   _createFileButton = (parent, options) => {

    // Create the input element.
    this._input = document.createElement("input");
    this._input.id = this._id;
    this._input.name = options.name;
    this._input.setAttribute("type", options.type);

    // Create the label element.
    this._label = document.createElement("label");
    this._label.setAttribute("for", this._id);

    // Add a text element to the label.
    const labelText = document.createElement("span");
    labelText.textContent = options.label;
    this._label.appendChild(labelText);

    // Add the input element and the label directly to the parent element.
    parent.appendChild(this._input);
    parent.appendChild(this._label);
  }

  /**
   *  Private method for creating a select element.
   *  @param    {Element}   parent    The parent element to which the select
   *                                  element will be added.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the form.
   *    @property   {string}  name      Registration name of the select. This
   *                                    should uniquely identify the select.
   *    @property   {array}   options   An array of options to add to the select
   *                                    element.
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   */
  _createSelect = (parent, options) => {

    // Create the select element.
    this._input = new FormSelect(parent, options);
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Make sure we remove the input element, as it could either be a DOM
    // element that we have a reference to, or a instance of a class object. In
    // either case, it should be removed.
    this._input.remove();

    // Remove all DOM elements.
    if (this._label) this._label.remove();

    // Call the original remove method. This also removes the container.
    super.remove();
  }
}

// Export the FormInput class so it can be imported elsewhere.
export { FormInput };
