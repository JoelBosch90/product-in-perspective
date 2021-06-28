// Import dependencies.
import { BaseElement } from "../widgets/BaseElement.js";
import { Form } from "../widgets/Form.js";
import { Apology } from "../widgets/Apology.js";
import { goTo } from "../tools/goTo.js";
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
    super(); // Create a container for this component.

    this._container = document.createElement("div");

    this._container.classList.add("registration", "component"); // Determine the form's title.


    const title = "Registration"; // Use the form's title as the page title.

    this.pageTitle(title); // Create a registration form.

    this._form = new Form(this._container, {
      title,
      center: true,
      params: {
        post: '/user'
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
      }, {
        name: "repeat",
        options: {
          label: "Repeat password",
          type: "password",
          required: true
        }
      }],
      buttons: [{
        name: "submit",
        options: {
          label: "Register",
          type: "submit"
        }
      }]
    }); // Go to the login page after a successful registration.

    this._form.on("stored", () => {
      // Remove all other content as we no longer need it.
      this.clear(); // Tell the user how to proceed.

      this._apology = new Apology(this._container, {
        // Explain what the user should expect next.
        title: "Click the link in your inbox to verify your account.",
        // Add a link to reload this component.
        link: {
          text: "Register a new account.",
          location: () => {
            // Clear our own cache.
            this.trigger("clearCache", [Registration]); // Then revisit this page.

            goTo('/register');
          }
        }
      });
    }); // Add the option to login using a password.


    this.addLink("Log in with a password.", () => void goTo('/login')); // Add the option to login using an email link.

    this.addLink("Log in with an email link.", () => void goTo('/login/link')); // Add the new element to the parent container.

    parent.appendChild(this._container);
  }
  /**
   *  Helper method to add a link below the form.
   *  @param  {string}    text      Anchor text.
   *  @param  {string}    callback  Action to perform.
   */


  addLink(text, callback) {
    // Create a new anchor for navigating the register page.
    const anchor = document.createElement('a');
    anchor.addEventListener('click', callback);
    anchor.textContent = text; // Add the anchor to a new paragraph and add that paragraph to the
    // container.

    const paragraph = document.createElement('p');
    paragraph.appendChild(anchor);

    this._container.appendChild(paragraph);
  }
  /**
   *  Helper method to clear all content of this form.
   *  @returns  {Registration}
   */


  clear() {
    // Remove the form if it exists.
    if (this._form) this._form.remove(); // Remove the apology if it exists.

    if (this._apology) this._apology.remove(); // Remove all other content there may be.

    while (this._container.firstChild) this._container.firstChild.remove(); // Allow chaining.


    return this;
  }
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */


  remove() {
    // Remove all content.
    this.clear(); // Call the BaseElement's remove function.

    super.remove();
  }

} // Export the Registration class so it can be imported elsewhere.


export { Registration };