// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { FormSelect } from "/javascript/widgets/Form/Select.js";
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
   *  A private variable reference to the select object.
   *  @var    {Select}
   */
  _select = null;
  /**
   *  To link an input and a label together, we need to have a unique ID.
   *  @var    {string}
   */

  _id = null;
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
    super(); // Assign a unique ID to this input object.

    this._id = 'input-' + this._uuidv4(); // Depending on the input type, we may need to create a different element.

    switch (options.type) {
      // Should we create a texarea element?
      case "textarea":
        this._createTextarea(parent, options);

        break;
      // Should we create an file upload button?

      case "file":
        this._createFileButton(parent, options);

        break;
      // Should we create a select element?

      case "select":
        this._createSelect(parent, options);

        break;
      // Otherwise, create a default input element.

      default:
        this._createInput(parent, options);

    }
  }
  /**
   *  Method for creating a unique ID.
   *  @returns  {string}
   */


  _uuidv4 = () => {
    // Based this GitHub repository: https://gist.github.com/jed/982883
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  };
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

    this._container.classList.add("input-field"); // Use the label for the on hover title.


    this._container.setAttribute("title", options.label); // Create the input element.


    this._input = document.createElement("input");
    this._input.id = this._id;
    this._input.name = options.name;

    this._input.setAttribute("type", options.type);

    this._input.setAttribute("placeholder", options.label); // Create the label element.


    this._label = document.createElement("label");

    this._label.setAttribute("for", this._id); // Add a text element to the label.


    const labelText = document.createElement("span");
    labelText.textContent = options.label;

    this._label.appendChild(labelText); // Add the input and the label to the container.


    this._container.appendChild(this._input);

    this._container.appendChild(this._label); // Add the input element to the parent element.


    parent.appendChild(this._container);
  };
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

    this._container.classList.add("input-field"); // Use the label for the on hover title.


    this._container.setAttribute("title", options.label); // Create the input element.


    this._input = document.createElement("textarea");
    this._input.id = this._id;
    this._input.name = options.name;

    this._input.setAttribute("type", options.type);

    this._input.setAttribute("placeholder", options.label); // Create the label element.


    this._label = document.createElement("label");

    this._label.setAttribute("for", this._id); // Add a text element to the label.


    const labelText = document.createElement("span");
    labelText.textContent = options.label;

    this._label.appendChild(labelText); // Add the input and the label to the container.


    this._container.appendChild(this._input);

    this._container.appendChild(this._label); // Add the input element to the parent element.


    parent.appendChild(this._container);
  };
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
   *    @property   {string}  accept    A string describing the file types that
   *                                    will be accepted.
   */

  _createFileButton = (parent, options) => {
    // Create a container for the input element.
    this._container = document.createElement("div");

    this._container.classList.add("file-button"); // Create the input element.


    const input = document.createElement("input");
    input.id = this._id;
    input.name = options.name;
    input.setAttribute("type", options.type); // Install the optional attributes.

    if (options.accept) input.setAttribute("accept", options.accept); // Create the label element.

    const label = document.createElement("label");
    label.setAttribute("for", this._id); // Add a text element to the label.

    const labelText = document.createElement("span");
    labelText.textContent = options.label;
    label.appendChild(labelText); // Listen for when a file is selected. We want to show the filename for
    // selected files.

    input.addEventListener("change", () => {
      // Get the list of selected files.
      const selected = input.files; // Install the label when no files are selected.

      if (!selected.length) label.textContent = options.label;else {
        // Get the selected File object.
        const file = selected[0]; // Update the label text.

        label.textContent = `${file.name} (${file.size} bytes)`;
      }
    }); // Add the input element and the label directly to the parent element.

    this._container.appendChild(input);

    this._container.appendChild(label);

    parent.appendChild(this._container);
  };
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
    this._container = new FormSelect(parent, options);
  };
} // Export the FormInput class so it can be imported elsewhere.


export { FormInput };