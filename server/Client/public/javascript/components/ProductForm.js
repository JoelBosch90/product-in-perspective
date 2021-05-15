// Import dependencies.
import { Request } from "/javascript/tools/Request.js";
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Form } from "/javascript/widgets/Form.js";
import { goTo } from "/javascript/tools/goTo.js";
/**
 *  The definition of the ProductForm class component that can be used to load
 *  a form to create a new product.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class ProductForm extends BaseElement {
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
   *  @param    {object}    formOptions     Optional parameters.
   *    @property {string}    productId       ID that identifies a product.
   */

  constructor(parent, options = {}) {
    // Call the base class constructor first.
    super(); // Create a container for this component.

    this._container = document.createElement("div");

    this._container.classList.add("productform"); // Create a new request object.


    this._request = new Request(); // First, request a list of all models. Store the promise.

    this._requestPromise = this._request.get('/model/all').catch(this._errorHandler).then(response => {
      // Get access to the JSON object.
      response.json().then(models => {
        // Use this component's error handling if an error has occurred with
        // the HTTP request.
        if (!response.ok) return this._errorHandler(models.error); // Create a new options array.

        const modelOptions = []; // Loop through all of the models.

        for (const model of models) {
          // Create a new option for each model.
          const modelOption = {}; // We want users to be able to select the model ID based on the
          // name.

          modelOption.value = model._id;
          modelOption.label = model.name; // Add the option to the array.

          modelOptions.push(modelOption);
        } // Create the form.


        this._createForm(modelOptions, options); // Add the new element to the parent container.


        parent.appendChild(this._container);
      });
    });
  }
  /**
   *  Private method to create the form and add it to the container.
   *  @param    {array}     modelOptions    An array of models to choose from.
   *  @param    {object}    formOptions     Optional parameters.
   *    @property {string}    productId       ID that identifies a product.
   */


  _createForm = (modelOptions, formOptions) => {
    // Do we have the ID for a specific product?
    const params = formOptions.productId // If so, we'll try to edit that product.
    ? {
      put: '/product/' + formOptions.productId,
      get: '/product/' + formOptions.productId
    } // If not, we'll create a new one.
    : {
      post: '/product'
    }; // Create a form for creating an new product.

    this._form = new Form(this._container, {
      title: "Product creation",
      center: true,
      params,
      inputs: [{
        name: "name",
        options: {
          label: "Name",
          type: "text",
          required: true
        }
      }, {
        name: "barcode",
        options: {
          label: "Barcode",
          type: "number",
          required: true
        }
      }, {
        name: "model",
        options: {
          label: "Select model ...",
          type: "select",
          options: modelOptions
        }
      }],
      buttons: [{
        name: "submit",
        options: {
          label: "Create model",
          type: "submit"
        }
      }]
    }); // When the product was stored successfully, return to the product overview.

    this._form.on("stored", () => void goTo('/admin/product'));
  };
  /**
   *  Private method for handling errors.
   *  @param    {Error}     error   Object describing the error that has
   *                                occurred.
   *  @TODO     Implement user friendly error handling.
   */

  _errorHandler = error => {
    // For now we want to simply log the error.
    console.error(error);
  };
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */

  remove() {
    // Remove the Form element once the request promise has resolved.
    this._requestPromise.then(() => {
      this._form.remove();
    }); // Call the BaseElement's remove function.


    super.remove();
  }

} // Export the ProductForm class so it can be imported elsewhere.


export { ProductForm };