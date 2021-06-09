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
    super();

    // Create a container for this component.
    this._container = document.createElement("div");
    this._container.classList.add("login", "component");

    // Create a login form.
    this._form = new Form(this._container, {
      title:      "Login",
      center:     true,
      params: {
        post:        '/login',
      },
      inputs: [
        {
          name:       "email",
          options: {
            label:      "Email address",
            type:       "email",
            required:   true,
          },
        },
        {
          name:       "password",
          options: {
            label:      "Password",
            type:       "password",
            required:   true,
          },
        },
      ],
      buttons: [
        {
          name:       "submit",
          options: {
            label:      "Login",
            type:       "submit",
          },
        },
      ],
    });

    // Listen for when the registration was successful.
    this._form.on("stored", response => {

      // Store the JSON Web Token.
      localStorage.setItem('jwt', response.token);

      // Move to the list of apps after login. Here we don't want to use our
      // usual `goTo` function as the `goTo` function prevents full page
      // reloads. Since we just logged in, we want a full page reload to clean
      // up client-side caching so that all artifacts from any previous sessions
      // disappear.
      window.location.href = "/admin/apps";
    });

    // Create a new link for navigating the register page.
    const link = document.createElement('a');
    link.addEventListener('click', () => void goTo('/register'));
    link.textContent = "No account? Register one here.";

    // Add the link to a new paragraph and add that paragraph to the container.
    const paragraph = document.createElement('p');
    paragraph.appendChild(link);
    this._container.appendChild(paragraph);

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

// Export the Login class so it can be imported elsewhere.
export { Login };
