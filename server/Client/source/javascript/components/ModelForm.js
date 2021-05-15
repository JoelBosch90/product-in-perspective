// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Request } from "/javascript/tools/Request.js";
import { Form } from "/javascript/widgets/Form.js";
import { goTo } from "/javascript/tools/goTo.js";

/**
 *  The definition of the ModelForm class component that can be used to load
 *  a form to create a new model.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class ModelForm extends BaseElement {

  /**
   *  Private variable that stores a reference to the container element in the
   *  DOM.
   *  @var      {Element}
   */
  _container = null;

  /**
   *  Private variable that stores a reference to the Form element.
   *  @var      {Form}
   */
  _form = null;

  /**
   *  Reference to the request object.
   *  @var      {Request}
   */
  _request = null;

  /**
   *  Reference to the API request for the apps.
   *  @var      {Promise}
   */
  _requestPromise = null;

  /**
   *  Class constructor.
   *  @param    {Element}   parent      Container to which this component will
   *                                    be added.
   *  @param    {object}    options     Optional parameters.
   *    @property {string}    modelId       ID that identifies a model.
   */
  constructor(parent, options = {}) {

    // Call the base class constructor first.
    super();

    // Create a container for this component.
    this._container = document.createElement("div");
    this._container.classList.add("modelform");

    // Create a new request object.
    this._request = new Request();

    // First, request a list of all apps. Store the promise.
    this._requestPromise = this._request.get('/app/all')
      .catch(this.errorHandler)
      .then(response => {

        // Get access to the JSON object.
        response.json().then(apps => {

          // Use the form's error handling if an error has occurred with the
          // HTTP request.
          if (!response.ok) return this.errorHandler(apps.error);

          // Create a new options array.
          const appOptions = [];

          // Loop through all of the apps.
          for (const app of apps) {

            // Create a new option for each app.
            const appOption = {};

            // We want users to be able to select the app ID based on the name.
            appOption.value = app._id;
            appOption.label = app.name;

            // Add the option to the array.
            appOptions.push(appOption);
          }

          // Create the form.
          this._createForm(appOptions, options);

          // Add the new element to the parent container.
          parent.appendChild(this._container);
        });
      });
  }

  /**
   *  Private method to create the form and add it to the container.
   *  @param    {array}     appOptions    An array of apps to choose from.
   *  @param    {object}    formOptions   Optional parameters.
   *    @property {string}    modelId       ID that identifies a model.
   */
  _createForm = (appOptions, formOptions) => {

    // Do we have the ID for a specific model?
    const params = formOptions.modelId

      // If so, we'll try to edit that model.
      ? { put: '/model/' + formOptions.modelId, get: '/model/' + formOptions.modelId }

      // If not, we'll create a new one.
      : { post: '/model' };

    // Create a form for creating an new model.
    this._form = new Form(this._container, {
      title: "Model creation",
      center: true,
      params,
      inputs: [
        {
          name:   "name",
          options:  {
            label:    "Name",
            type:     "text",
            required: true,
          },
        },
        {
          name:   "model",
          options:  {
            label:  "Upload model ...",
            accept: ".glTF",
            type:   "file",
          },
        },
        {
          name:   "app",
          required: true,
          options:  {
            type:     "select",
            options:  appOptions,
          },
        },
      ],
      fieldsets: [],
      buttons: [
        {
          name:   "submit",
          options: {
            label:  formOptions.modelId ? "Edit model" : "Create model",
            type:   "submit",
          },
        },
      ],
    });


    // When the model was stored successfully, return to the model overview.
    this._form.on("stored", () => void goTo('/admin/model'));
  }

  /**
   *  Private method for handling errors.
   *  @param    {Error}     error   Object describing the error that has
   *                                occurred.
   *  @TODO     Implement user friendly error handling.
   */
  _errorHandler = error => {

    // For now we want to simply log the error.
    console.error(error);
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Remove the Form element once the request promise has resolved.
    this._requestPromise.then(() => { this._form.remove(); });

    // Call the BaseElement's remove function.
    super.remove();
  }
}

// Export the ModelForm class so it can be imported elsewhere.
export { ModelForm };
