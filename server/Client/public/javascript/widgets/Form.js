// Import dependencies.
import { Request } from "/javascript/tools/Request.js";
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { FormInput } from "/javascript/widgets/Form/Input.js";
import { FormFieldset } from "/javascript/widgets/Form/Fieldset.js";
import { Button } from "/javascript/widgets/Button.js";
import { Title } from "/javascript/widgets/Title.js";
import { ErrorDisplay } from "/javascript/widgets/ErrorDisplay.js";
/**
 *  The definition of the Form class that can be used to create a form element.
 *
 *  @event      submit        Triggered when the user opts to submit the form.
 *                            Will contain a FormData object with the submitted
 *                            data from the form.
 *  @event      stored        Triggered when the API call has succeeded. Will
 *                            contain the server response data.
 *  @event      error         Triggered when the API call has failed. Will
 *                            contain the server response data.
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
   *  Element that displays error messages.
   *  @var      {ErrorDisplay}
   */

  _errorDisplay = null;
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
   *  Reference to the parameters we'll need for the API call.
   *  @var      {object}
   */

  _params = null;
  /**
   *  Reference to the request object.
   *  @var      {Request}
   */

  _request = null;
  /**
   *  Class constructor.
   *  @param    {Element}   parent      The parent element to which the form
   *                                    will be added.
   *  @param    {object}    options     Optional parameters for instantiating
   *                                    the form.
   *    @property   {array}   buttons     Optional array of buttons that are
   *                                      immediately added to the form.
   *    @property   {array}   inputs      Optional array of inputs that are
   *                                      immediately added to the form.
   *    @property   {string}  title       Optional string for a title to add to
   *                                      the form.
   *    @property   {boolean} center      Should this form be centered in the
   *                                      parent element?
   *                                      Default: false.
   *    @property   {object}    params    Optional parameters for submitting the
   *                                      form and performing the API call. This
   *                                      object can contain 'get', 'post', or
   *                                      'put' objects with the parameters of
   *                                      API calls. If the 'get' object is
   *                                      provided, the 'post' object will be
   *                                      ignored.
   *     @property     {string}  get        An string containing the API
   *                                        endpoint used for getting the
   *                                        information to prefill the form.
   *     @property     {string}  put        An string containing the API
   *                                        endpoint used for submitting the
   *                                        form when editing an entity.
   *     @property     {string}  post       An string containing the API
   *                                        endpoint used for submitting the
   *                                        form when creating a new entity.
   */

  constructor(parent, options = {}, params) {
    // Call the parent class's constructor.
    super(); // Create a container for the form.

    this._container = document.createElement("form"); // Create a new request object.

    this._request = new Request(); // Store the API parameters.

    if (options.params) this._params = options.params; // Make sure we listen to submit events.

    this._container.addEventListener('submit', this.submit); // Add the title if requested.


    if (options.title) this.title(options.title); // Add an ErrorDisplay under the main title.

    this._errorDisplay = new ErrorDisplay(this._container); // Add the center class to the form if requested.

    if (options.center) this._container.classList.add("center"); // Add all provided buttons and inputs to the form.

    if (options.inputs) for (const input of options.inputs) this.addInput(input.name, input.options);
    if (options.fieldsets) for (const fieldset of options.fieldsets) this.addFieldset(fieldset.name, fieldset.options);
    if (options.buttons) for (const button of options.buttons) this.addButton(button.name, button.options); // If we got a GET parameter, we can try to prefill data in this form.

    if (options.params && options.params.get) this._request.get(options.params.get).then(this._prefill).catch(error => this.showError(error)); // Add the form to the parent element.

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
   *  Method to submit the form.
   *  @param    {Event}     event     Optional parameter that is supplied if
   *                                  this method is used as a callback for an
   *                                  event listener.
   *  @returns  {Promise|undefined}
   */

  submit = event => {
    // We don't ever want to reload a page to submit a form. So we prevent the
    // default submit behaviour here if this method was called an part of an
    // event listener.
    if (event) event.preventDefault(); // Get the values from the form.

    const values = this.values(); // Trigger the submit event and provide the submitted values.

    this.trigger('submit', values); // We cannot perform any HTTP requests without parameters.

    if (!this._params) return; // If we have the parameters for a PUT request, perform the PUT request.

    if (this._params.put) return this._request.put(this._params.put, values).then(this._submitResponseHandler).catch(error => this.showError(error)); // If we don't have the parameters for a PUT request, but we do have the
    // parameters for a POST request, perform the POST request.

    if (this._params.post) return this._request.post(this._params.post, values).then(this._submitResponseHandler).catch(error => this.showError(error));
  };
  /**
   *  Private method for handling an HTTP submit request response.
   *  @param    {Response}  reponse Reponse object from an HTTP request.
   */

  _submitResponseHandler = response => {
    // Get access to the JSON object.
    response.json().then(json => {
      // Use the form's error handling if an error has occurred with the HTTP
      // request.
      if (!response.ok) return this.showError(json.error); // Otherwise, we can trigger the 'stored' event.

      this.trigger("stored", json);
    });
  };
  /**
   *  Method for showing errors.
   *  @param    {string}      error   Error message.
   *  @returns  {Form}
   */

  showError = error => {
    // Clear the error display to show the new error.
    this._errorDisplay.clear().add(error); // Allow chaining.


    return this;
  };
  /**
   *  Private method for prefilling form fields with an HTTP request response.
   *  @param    {Response}  reponse Reponse object from an HTTP request.
   */

  _prefill = response => {
    // Get access to the JSON object.
    response.json().then(json => {
      // Use the form's error handling if an error has occurred with the HTTP
      // request.
      if (!response.ok) return this.showError(json.error); // Prefill all data.

      this.values(json);
    });
  };
  /**
   *  Method for getting or setting the values of all input elements in this
   *  form.
   *
   *  @getter
   *    @returns  {object}
   *
   *  @setter
   *    @param    {object}  newData  The new data to be used as inputs.
   *    @returns  {Form}
   */

  values = newData => {
    // Is this used as a getter?
    if (newData === undefined) {
      // Get the data from the form.
      const data = new FormData(this._container); // Convert the data to an object and return that.

      return Object.fromEntries(data.entries());
    } // Loop through all information we got to see if we should prefill an
    // input field.


    for (const [name, value] of Object.entries(newData)) {
      // See if there is an input with this name.
      const input = this._inputs[name]; // If so, set the correct value.

      if (input) input.value(value);
    } // Make sure that we also propagate this behaviour to fieldsets.


    for (const fieldset of Object.values(this._fieldsets)) fieldset.values(newData); // Allow chaining.


    return this;
  };
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */

  remove() {
    // Remove class objects we created.
    if (this._title) this._title.remove();
    if (this._inputs) for (const input of Object.values(this._inputs)) input.remove();
    if (this._fieldsets) for (const fieldset of Object.values(this._fieldsets)) fieldset.remove();
    if (this._buttons) for (const button of Object.values(this._buttons)) button.remove();
    if (this._request) this._request.remove(); // Remove all references.

    this._title = null;
    this._inputs = {};
    this._fieldsets = {};
    this._buttons = {}; // Call the remove function for the base class. This will also remove the
    // container.

    super.remove();
  }

} // Export the Form class so it can be imported elsewhere.


export { Form };