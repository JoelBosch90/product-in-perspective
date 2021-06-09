// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Button } from "/javascript/widgets/Button.js";

/**
 *  The definition of the Modal class that can be used to create an overlay over
 *  the entire page. This is usually used to request the user to confirm
 *  something before proceeding.
 *
 *  Note that because the modal attaches to the entire page,
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
 class Modal extends BaseElement {

  /**
   *  A private variable reference to the message element.
   *  @var    {Element}
   */
  _message = null;

  /**
   *  A private variable reference to the buttons container.
   *  @var    {Element}
   */
  _buttonContainer = null;

  /**
   *  A private array that keeps track of our buttons.
   *  @var    {array}
   */
  _buttons = [];

  /**
   *  Class constructor.
   *  @param    {Object}    options   The optional parameters.
   *    @property {string}    title         Title to display to the user.
   *    @property {string}    description   Description to display to the user.
   */
  constructor(options = {}) {

    // Call the base class constructor.
    super();

    // Create a container for the modal. This will act as the backdrop for the
    // modal.
    this._container = document.createElement("div");
    this._container.classList.add("modal");

    // Create a separate container for the message.
    this._message = document.createElement("div");
    this._message.classList.add("message");
    this._container.appendChild(this._message);

    // Create a title element if requested.
    if (options.title) {
      const title = document.createElement("h1");
      title.textContent = options.title;
      this._message.appendChild(title);
    }

    // Create a description element if requested.
    if (options.description) {
      const description = document.createElement("p");
      description.textContent = options.description;
      this._message.appendChild(description);
    }

    // Add the modal to the body of the page.
    document.body.appendChild(this._container);
  }

  /**
   *  Method for add a button to the card.
   *  @param    {object}    options       Button options.
   *  @returns  {Button}
   */
  addButton = options => {

    // If there is no buttons container yet, we should first create one.
    if (!this._buttonContainer) {

      // Create a buttons container and add it to the main container.
      this._buttonContainer = document.createElement("div");
      this._buttonContainer.classList.add("buttons");
      this._message.appendChild(this._buttonContainer);
    }

    // Create the new button.
    const button = new Button(this._buttonContainer, options);

    // Add it to our array of buttons.
    this._buttons.push(button);

    // Expose the button.
    return button;
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Remove all class objects we've created.
    if (this._buttons) for (const button of this._buttons) button.remove();

    // Remove DOM elements.
    if (this._message) this._message.remove();
    if (this._buttonContainer) this._buttonContainer.remove();

    // Reset the buttons array.
    this._buttons = [];

    // Call the original remove method. This also removes the container.
    super.remove();
  }
}

// Export the Modal class so it can be imported elsewhere.
export { Modal };