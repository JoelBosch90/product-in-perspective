// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Form } from "/javascript/widgets/Form.js";
import { goTo } from "/javascript/tools/goTo.js";
/**
 *  The definition of the Login class component that can be used to load a login
 *  form.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class Login extends BaseElement {
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

    this._container = document.createElement("div"); // Create a login form.

    this._form = new Form(this._container, {
      title: "Login",
      center: true,
      params: {
        post: '/login'
      },
      inputs: [{
        name: "email",
        options: {
          label: "Email address",
          type: "email",
          required: true
        }
      }, {
        name: "password",
        options: {
          label: "Password",
          type: "password",
          required: true
        }
      }],
      buttons: [{
        name: "submit",
        options: {
          label: "Login",
          type: "submit"
        }
      }]
    }); // Listen for when the registration was successful.

    this._form.on("stored", response => {
      // @TODO Do this in a much safer way. Currently, this is unprotected
      // against cross site scripting!!!
      localStorage.setItem('jwt', response.token); // Move to the list of apps after login.

      goTo('/admin/app');
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

} // Export the Login class so it can be imported elsewhere.


export { Login };