// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Form } from "/javascript/widgets/Form.js";

/**
 *  The definition of the PasswordForm class component that can be used to load
 *  a form to change a password.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class PasswordForm extends BaseElement {

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

    // Create a change password.
    this._form = new Form(this._container, {
      title: "Change password",
      center: true,
      inputs: [
        {
          name:   "password",
          options: {
            label:  "Password",
            type:   "password",
          },
        },
        {
          name:   "repeat",
          options: {
            label:  "Repeat password",
            type:   "password",
          },
        },
      ],
      buttons: [
        {
          name:   "submit",
          options: {
            label:  "Change",
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

// Export the PasswordForm class so it can be imported elsewhere.
export { PasswordForm };