// Import dependencies.
import { BaseElement } from "../widgets/BaseElement.js";
import { Form } from "../widgets/Form.js";
import { goTo } from "../tools/goTo.js";

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

    // Determine the form's title.
    const title = "Login";

    // Use the form's title as the page title.
    this.pageTitle(title);

    // Create a login form.
    this._form = new Form(this._container, {
      title,
      center:  true,
      params: {
        post: '/login',
      },
      inputs: [
        {
          name: "email",
          options: {
            label: "Email address",
            type: "email",
            required: true,
          },
        },
        {
          name: "password",
          options: {
            label: "Password",
            type: "password",
            required: true,
          },
        },
      ],
      buttons: [
        {
          name: "submit",
          options: {
            label: "Login",
            type: "submit",
          },
        },
      ],
    });

    // Listen for when the registration was successful.
    this._form.on("stored", response => {

      // Move to the list of apps after login.
      goTo("/admin/apps");
    });

    // Add the option to login using an email link.
    this.addLink("Log in with an email link.", '/login/link');

    // Add the option to register a new account.
    this.addLink("Register a new account.", '/register');

    // Add the new element to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Helper method to add a link below the form.
   *  @param  {string}    text    Anchor text.
   *  @param  {string}    link    Url to navigate to.
   */
  addLink(text, link) {

    // Create a new anchor for navigating the register page.
    const anchor = document.createElement('a');
    anchor.addEventListener('click', () => void goTo(link));
    anchor.textContent = text;

    // Add the anchor to a new paragraph and add that paragraph to the
    // container.
    const paragraph = document.createElement('p');
    paragraph.appendChild(anchor);
    this._container.appendChild(paragraph);
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
