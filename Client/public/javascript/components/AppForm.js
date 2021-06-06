// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Form } from "/javascript/widgets/Form.js";
import { goTo } from "/javascript/tools/goTo.js";
/**
 *  The definition of the AppForm class component that can be used to load
 *  a form to create a new app.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class AppForm extends BaseElement {
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
   *  Class constructor.
   *  @param    {Element}   parent      Container to which this component will
   *                                    be added.
   *  @param    {object}    options     Optional parameters.
   *    @property {string}    appId       ID that identifies an app.
   */

  constructor(parent, options = {}) {
    // Call the base class constructor first.
    super(); // Do we have the ID for a specific app?

    const params = options.appId // If so, we'll try to edit that app.
    ? {
      put: '/app/' + options.appId,
      get: '/app/' + options.appId
    } // If not, we'll create a new one.
    : {
      post: '/app'
    }; // Create a container for this component.

    this._container = document.createElement("div");

    this._container.classList.add("appform", "component"); // Create a form for creating an app.


    this._form = new Form(this._container, {
      title: "App creation",
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
        name: "description",
        options: {
          label: "Description",
          type: "textarea"
        }
      }, {
        name: "path",
        options: {
          label: "Path",
          type: "text",
          required: true
        }
      }, {
        name: "exit-button",
        options: {
          label: "Exit button",
          type: "text",
          required: true
        }
      }],
      fieldsets: [{
        name: "scanning",
        options: {
          legend: "Texts in scanning mode",
          inputs: [{
            name: "title",
            options: {
              label: "Title",
              type: "text"
            }
          }, {
            name: "description",
            options: {
              label: "Description",
              type: "textarea"
            }
          }, {
            name: "button",
            options: {
              label: "Button",
              type: "text",
              required: true
            }
          }]
        }
      }, {
        name: "placing",
        options: {
          legend: "Texts in placing mode",
          inputs: [{
            name: "title",
            options: {
              label: "Title",
              type: "text"
            }
          }, {
            name: "description",
            options: {
              label: "Description",
              type: "textarea"
            }
          }, {
            name: "button",
            options: {
              label: "Button",
              type: "text",
              required: true
            }
          }]
        }
      }],
      buttons: [{
        name: "submit",
        options: {
          label: options.appId ? "Edit app" : "Create app",
          type: "submit"
        }
      }]
    }); // When the app was stored successfully, return to the app overview.

    this._form.on("stored", () => void goTo('/admin/apps')); // Add the new element to the parent container.


    parent.appendChild(this._container);
  }
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */


  remove() {
    // Remove the Form element.
    this._form.remove(); // Call the BaseElement's remove function.


    super.remove();
  }

} // Export the AppForm class so it can be imported elsewhere.


export { AppForm };