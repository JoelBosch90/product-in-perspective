// Import dependencies.
import { BaseElement } from "../widgets/BaseElement.js";
import { Request } from "../tools/Request.js";
import { Form } from "../widgets/Form.js";
import { goTo } from "../tools/goTo.js";

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
    this._container.classList.add("modelform", "component");

    // Create a new request object.
    this._request = new Request();

    // Create the form.
    this._createForm(options);

    // Add this componenet to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Private method to create the form and add it to the container.
   *  @param    {object}    formOptions   Optional parameters.
   *    @property {string}    modelId       ID that identifies a model.
   */
  _createForm = (formOptions) => {

    // Do we have the ID for a specific model?
    const params = formOptions.modelId

      // If so, we'll try to edit that model.
      ? { put: '/model/' + formOptions.modelId, get: '/model/' + formOptions.modelId }

      // If not, we'll create a new one.
      : { post: '/model' };

    // Determine the form's title.
    const title = formOptions.modelId ? "Model configuration" : "Model creation";

    // Use the form's title as the page title.
    this.pageTitle(title);

    // Create a form for creating an new model.
    this._form = new Form(this._container, {
      title,
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
            // accept: ".glTF",
            type:   "file",
          },
        },
        {
          name:   "multiplier",
          options:  {
            label:    "Multiplier",
            type:     "number",
          },
        },
        {
          name:   "scale",
          options:  {
            label:    "Scale",
            type:     "number",
            step:     "any",
          },
        },
      ],
      fieldsets: [
        {
          name: "viewing",
          options: {
            legend: "Texts in viewing mode",
            inputs: [
              {
                name: "title",
                options: {
                  label:  "Title",
                  type:   "text",
                },
              },
              {
                name: "description",
                options: {
                  label:  "Description",
                  type:   "textarea",
                },
              },
              {
                name: "button",
                options: {
                  label:    "Button",
                  type:     "text",
                  required: true,
                },
              },
            ],
          },
        },
      ],
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
    this._form.on("stored", () => void goTo('/admin/models'));
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Remove the Form element once the request promise has resolved.
    this._form.remove();

    // Call the BaseElement's remove function.
    super.remove();
  }
}

// Export the ModelForm class so it can be imported elsewhere.
export { ModelForm };
