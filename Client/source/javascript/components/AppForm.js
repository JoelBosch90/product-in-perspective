// Import dependencies.
import { AppList } from "./AppList.js";
import { ProductForm } from "./ProductForm.js";
import { BaseElement } from "../widgets/BaseElement.js";
import { Form } from "../widgets/Form.js";
import { goTo } from "../tools/goTo.js";

/**
 *  The definition of the AppForm class component that can be used to load
 *  a form to create a new app.
 *
 *  @event      clearCache    Triggered when the form has been stored to prevent
 *                            displaying old data.
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
    super();

    // Do we have the ID for a specific app?
    const params = options.appId

      // If so, we'll try to edit that app.
      ? { put: '/app/' + options.appId, get: '/app/' + options.appId }

      // If not, we'll create a new one.
      : { post: '/app' };

    // Create a container for this component.
    this._container = document.createElement("div");
    this._container.classList.add("appform", "component");

    // Determine the form's title.
    const title = options.appId ? "App configuration" : "App creation";

    // Use the form's title as the page title.
    this.pageTitle(title);

    // Create a form for creating an app.
    this._form = new Form(this._container, {
      title,
      center:   true,
      params,
      inputs: [
        {
          name: "name",
          options: {
            label:    "Name",
            type:     "text",
            tooltip:  "Give your app a name. This name is also visible to users in the browser tab.",
            required: true,
          },
        },
        {
          name: "description",
          options: {
            label:    "Description",
            type:     "textarea",
            tooltip:  "Give your app a description. This description is only visible to you.",
          },
        },
        {
          name: "path",
          options: {
            label:    "Path",
            type:     "text",
            tooltip:  "Give your app a path. This is the last part of the URL where the app will appear. It has to be unique.",
            required: true,
          },
        },
        {
          name: "exit-button",
          options: {
            label:    "Exit button",
            type:     "text",
            tooltip:  "In the augmented reality scene, an app always has a button that allows the user to exit the scene. Here you can decide the text for this button.",
            required: true,
          },
        },
      ],
      fieldsets: [
        {
          name: "scanning",
          options: {
            legend:   "Texts in scanning mode",
            tooltip:  "These are the texts that will appear when a user is scanning a product.",
            inputs: [
              {
                name: "title",
                options: {
                  label:    "Title",
                  type:     "text",
                  tooltip:  "This is the title that will appear when a user is scanning a product.",
                }
              },
              {
                name: "description",
                options: {
                  label:    "Description",
                  type:     "textarea",
                  tooltip:  "This is the description that will appear when a user is scanning a product. This is the perfect place to give the user hints for how to scan a product.",
                }
              },
              {
                name: "button",
                options: {
                  label:    "Button",
                  type:     "text",
                  tooltip:  "This is the text for the button that the user uses to select a product that they have scanned. By clicking this button, the user enters the augmented reality scene.",
                  required: true,
                }
              },
            ],
          },
        },
        {
          name: "placing",
          options: {
            legend: "Texts in placing mode",
            tooltip:  "These are the texts that will appear when a user is detecting surfaces on which to place the 3D models.",
            inputs: [
              {
                name: "title",
                options: {
                  label:    "Title",
                  type:     "text",
                  tooltip:  "This is the title that will appear when a user is detecting surfaces on which to place the 3D models.",
                },
              },
              {
                name: "description",
                options: {
                  label:  "Description",
                  type:   "textarea",
                  tooltip:  "This is the description that will appear when a user is detecting surfaces on which to place the 3D models. This is the perfect place to give the user hints for how to detect a surface.",
                },
              },
              {
                name:       "button",
                options: {
                  label:    "Button",
                  type:     "text",
                  tooltip:  "This is the text for the button that the user uses to select a surface that they have detected. By clicking this button, the user places the first 3D model.",
                  required: true,
                },
              },
            ],
          },
        },
      ],
      buttons: [
        {
          name: "submit",
          options: {
            label:  options.appId ? "Edit app" : "Create app",
            type:   "submit",
          },
        },
      ],
    });

    // When the app was stored successfully, return to the app overview.
    this._form.on("stored", () => {

      // We should clear the cache related to apps, as we have probably changed
      // something.
      this.trigger("clearCache", [AppForm, AppList, ProductForm]);

      // Return the the app overview.
      goTo('/admin/apps');
    });

    // Add the new element to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Remove the Form element.
    this._form.remove();

    // Call the BaseElement's remove function.
    super.remove();
  }
}

// Export the AppForm class so it can be imported elsewhere.
export { AppForm };
