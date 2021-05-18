// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Form } from "/javascript/widgets/Form.js";
import { goTo } from "/javascript/tools/goTo.js";

/**
 *  The definition of the Registration class component that can be used to load
 *  a registration form.
 *
 *  @event      navigate      Triggered when the this component has finished.
 *                            May contain a suggestion for the component to load
 *                            next.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Registration extends BaseElement {

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
    this._container.classList.add("registration");

    // Create a registration form.
    this._form = new Form(this._container, {
      title:      "Registration",
      center:     true,
      params: {
        post:       '/user',
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
        {
          name:       "repeat",
          options: {
            label:      "Repeat password",
            type:       "password",
            required:   true,
          },
        },
      ],
      buttons: [
        {
          name:       "submit",
          options: {
            label:      "Register",
            type:       "submit",
          },
        },
      ],
    });

    // Go to the login page after a successful registration.
    this._form.on("stored", () => void goTo('/login'));

    // Create a new link for navigating the login page.
    const link = document.createElement('a');
    link.addEventListener('click', () => void goTo('/login'));
    link.textContent = "Already an account? Login here.";

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

// Export the Registration class so it can be imported elsewhere.
export { Registration };
