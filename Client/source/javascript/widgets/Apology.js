// Import dependencies.
import { BaseElement } from "../widgets/BaseElement.js";
import { goTo } from "../tools/goTo.js";

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
   *  @param    {Object}    link      Optional link for navigation.
   *    @property {string}    text      The text to display for the link.
   *    @property {string}    location  Where to navigate to.
   */
  constructor(parent, message, link) {

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

    // Add the link if requested.
    if (link) this.addLink(link.text, link.location);

    // Add the overlay to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Method to update the current message.
   *  @param      {string}    message   The new message to install.
   *  @returns    {Apology}
   */
  update = message => {

    // Install the new message by overwriting the previous one.
    this._title.textContent = message;

    // Allow chaining.
    return this;
  }

  /**
   *  Private method to add anchors to a container.
   *  @param  {string}      text        The text for the link.
   *  @param  {string}      location    The location to which the link should
   *                                    redirect.
   */
  addLink = (text, location) => {

    // Create the anchor.
    const anchor = document.createElement("a");

    // Make the anchor tag look like a button.
    anchor.classList.add("button");

    // While we will overwrite clicks on the anchor tag, we should still add
    // the href so that it can use all other uses of an anchor tag, like copy
    // link on right click and open in different tab with middle mouse click.
    anchor.setAttribute("href", location);

    // Add the text.
    anchor.textContent = text;

    // Navigate to the right page when this anchor is clicked.
    anchor.addEventListener("click", event => {

      // We don't want to use the regular click event on anchor tags to
      // navigate, as that will reload the page.
      event.preventDefault();

      // Instead we use our own goTo function to navigate.
      goTo(location);
    });

    // Add the anchor to the navigation menu.
    this._container.appendChild(anchor);
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