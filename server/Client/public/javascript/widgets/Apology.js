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
   *  Class constructor.
   *  @param    {Element}   parent    The parent element on which the
   *                                  overlay interface will be installed.
   *  @param    {string}    message   Message to display to the user.
   */
  constructor(parent, message) {
    // Call the base class constructor.
    super(); // Create a container for the overlay.

    this._container = document.createElement("div");

    this._container.classList.add("apology"); // Create the message to display.


    const title = document.createElement("h1");
    title.textContent = message; // Add the message.

    this._container.appendChild(title); // Add the overlay to the parent container.


    parent.appendChild(this._container);
  }

} // Export the Apology class so it can be imported elsewhere.


export { Apology };