// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Form } from "/javascript/widgets/Form.js";
/**
 *  The definition of the CreateModel class component that can be used to load
 *  a form to create a new model.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class CreateModel extends BaseElement {
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
    super(); // Create a container for this component.

    this._container = document.createElement("div"); // Create a form for creating an new model.

    this._form = new Form(this._container, {
      title: "Model creation",
      center: true,
      inputs: [{
        name: "name",
        options: {
          label: "Name",
          type: "text"
        }
      }, {
        name: "model",
        options: {
          label: "Upload model ...",
          accept: ".glTF",
          type: "file"
        }
      }],
      fieldsets: [],
      buttons: [{
        name: "submit",
        options: {
          label: "Create model",
          type: "submit"
        }
      }]
    }); // Add the new element to the parent container.

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

} // Export the CreateModel class so it can be imported elsewhere.


export { CreateModel };