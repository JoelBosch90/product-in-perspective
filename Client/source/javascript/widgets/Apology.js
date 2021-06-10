// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";

/**
 *  The definition of the Apology class that can be used to create an apology
 *  message. This can be used to explain to a user why something cannot be
 *  displayed.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
 class Apology extends BaseElement {

  /**
   *  Reference to the header element we are using.
   *  @var      {Element}
   */
  _title = null;

  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element on which the
   *                                  overlay interface will be installed.
   *  @param    {string}    message   Message to display to the user.
   */
  constructor(parent, message) {

    // Call the base class constructor.
    super();

    // Create a container for the overlay.
    this._container = document.createElement("div");
    this._container.classList.add("apology");

    // Create the message to display.
    this._title = document.createElement("h1");
    this._title.textContent = message;

    // Add the message.
    this._container.appendChild(this._title);

    // Add the overlay to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Method to update the current message.
   *  @param      {string}    message   The new message to install.
   *  @returns    {Apology}
   */
  update = () => {

    // Install the new message by overwriting the previous one.
    this._title.textContent = message;

    // Allow chaining.
    return this;
  }

  /**
   *  Method to remove the current object.
   */
  remove() {

    // Remove the title.
    if (this._title) this._title.remove();

    // Let the BaseElement remove the container.
    super.remove();
  }
}

// Export the Apology class so it can be imported elsewhere.
export { Apology };