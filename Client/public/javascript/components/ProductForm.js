// Import dependencies.
import { Request } from "../tools/Request.js";
import { BaseElement } from "../widgets/BaseElement.js";
import { Form } from "../widgets/Form.js";
import { goTo } from "../tools/goTo.js";
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
   *  Reference to the Select input object for the models.
   *  @var      {Select}
   */

  _modelsSelect = null;
  /**
   *  Reference to the Select input object for the products.
   *  @var      {Select}
   */

  _productsSelect = null;
  /**
   *  Reference to the request object.
   *  @var      {Request}
   */

  _request = null;
  /**
   *  Reference to the API request for the models.
   *  @var      {Promise}
   */

  _modelsRequest = null;
  /**
   *  Reference to the API request for the apps.
   *  @var      {Promise}
   */

  _appsRequest = null;
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

    this._container.classList.add("productform", "component"); // Create a new request object.


    this._request = new Request(); // Create the form.

    this._createForm(options); // Add the new element to the parent container.


    parent.appendChild(this._container); // First, request a list of all models. Store the promise.

    this._modelsRequest = this._request.get('/models').catch(error => void this._form.showError(error)).then(response => {
      // Get access to the JSON object.
      if (response) response.json().then(models => {
        // Use this component's error handling if an error has occurred with
        // the HTTP request.
        if (!response.ok) return this._form.showError(models.error); // Loop through all of the models.

        for (const model of models) {
          // Add the model to the select input.
          this._modelsSelect.addOption(model._id, model.name);
        }
      });
    }); // Secondlly, request a list of all apps. Store the promise.

    this._appsRequest = this._request.get('/apps').catch(error => void this._form.showError(error)).then(response => {
      // Get access to the JSON object.
      if (response) response.json().then(apps => {
        // Use this component's error handling if an error has occurred with
        // the HTTP request.
        if (!response.ok) return this._form.showError(apps.error); // Loop through all of the apps.

        for (const app of apps) {
          // Add the app to the select input.
          this._appsSelect.addOption(app._id, app.name);
        }
      });
    });
  }
  /**
   *  Private method to create the form and add it to the container.
   *  @param    {object}    formOptions     Optional parameters.
   *    @property {string}    productId       ID that identifies a product.
   */


  _createForm = formOptions => {
    // Do we have the ID for a specific product?
    const params = formOptions.productId // If so, we'll try to edit that product.
    ? {
      put: '/product/' + formOptions.productId,
      get: '/product/' + formOptions.productId
    } // If not, we'll create a new one.
    : {
      post: '/product'
    }; // Determine the form's title.

    const title = formOptions.productId ? "Product configuration" : "Product creation"; // Use the form's title as the page title.

    this.pageTitle(title); // Create a form for creating an new product.

    this._form = new Form(this._container, {
      title,
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
      }]
    }); // Create the select input for the models seperately so that we can save a
    // reference that we can load the options to later on.

    this._modelsSelect = this._form.addInput("models", {
      label: "Models",
      placeholder: "Select model ...",
      type: "multiselect"
    }); // Create the select input for the apps seperately so that we can save a
    // reference that we can load the options to later on.

    this._appsSelect = this._form.addInput("app", {
      placeholder: "Select app ..",
      type: "select"
    }); // We want to add the button at the bottom of the form.

    this._form.addButton("submit", {
      label: formOptions.productId ? "Edit product" : "Create product",
      type: "submit"
    }); // When the product was stored successfully, return to the product overview.


    this._form.on("stored", () => void goTo('/admin/products'));
  };
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */

  remove() {
    // Remove the Form element once the all requests have been resolved.
    Promise.all([this._modelsRequest, this._appsRequest]).then(() => {
      this._form.remove();
    }); // Call the BaseElement's remove function.

    super.remove();
  }

} // Export the ProductForm class so it can be imported elsewhere.


export { ProductForm };