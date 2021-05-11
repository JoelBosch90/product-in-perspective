// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Form } from "/javascript/widgets/Form.js";

/**
 *  The definition of the AppCreator class component that can be used to load
 *  a form to create a new app.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class AppCreator extends BaseElement {

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
   *  @param    {array}     options
   */
  constructor(parent, options = {}) {

    // Call the base class constructor first.
    super();

    // Create a container for this component.
    this._container = document.createElement("div");

    // Create a form for creating an app.
    this._form = new Form(this._container, {
      title: "App creation",
      center: true,
      inputs: [
        {
          name:   "name",
          options: {
            label:  "Name",
            type:   "text",
          },
        },
        {
          name:   "description",
          options: {
            label:  "Description",
            type:   "textarea",
          },
        },
        {
          name:   "slug",
          options: {
            label:  "Slug",
            type:   "text",
          },
        },
      ],
      fieldsets: [
        {
          name:   "scanning",
          options: {
            legend: "Texts in scanning mode",
            inputs: [
              {
                name:   "title",
                options: {
                  label:  "Title",
                  type:   "text",
                }
              },
              {
                name:   "description",
                options: {
                  label:  "Description",
                  type:   "textarea",
                }
              },
              {
                name:   "button",
                options: {
                  label:  "Button",
                  type:   "text",
                }
              },
            ],
          },
        },
        {
          name:   "placing",
          options: {
            legend: "Texts in placing mode",
            inputs: [
              {
                name:   "title",
                options: {
                  label:  "Title",
                  type:   "text",
                },
              },
              {
                name:   "description",
                options: {
                  label:  "Description",
                  type:   "textarea",
                },
              },
              {
                name:   "button",
                options: {
                  label:  "Button",
                  type:   "text",
                },
              },
            ],
          },
        },
        {
          name:   "viewing",
          options: {
            legend: "Texts in viewing mode",
            inputs: [
              {
                name:   "title",
                options: {
                  label:  "Title",
                  type:   "text",
                },
              },
              {
                name:   "description",
                options: {
                  label:  "Description",
                  type:   "textarea",
                },
              },
              {
                name:   "button",
                options: {
                  label:  "Button",
                  type:   "text",
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
            label:  "Create app",
            type:   "submit",
          },
        },
      ],
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

// Export the AppCreator class so it can be imported elsewhere.
export { AppCreator };
