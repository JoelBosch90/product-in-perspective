/**
 *  The definition of the Apology class that can be used to create an apology
 *  message. This can be used to explain to a user why something cannot be
 *  displayed.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
 class Apology {

  /**
   *  Private variable that stores a reference to the container element in the
   *  DOM.
   *  @var      {Element}
   */
  _container = null;

  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element on which the
   *                                  overlay interface will be installed.
   *  @param    {string}    message   Message to display to the user.
   */
  constructor(parent, message) {

    // Create a container for the overlay.
    this._container = document.createElement("div");
    this._container.classList.add("apology");

    // Create the message to display.
    const title = document.createElement("h1");
    title.textContent = message;

    // Add the message.
    this._container.appendChild(title);

    // Add the overlay to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Method to show the overlay interface.
   *  @returns  {Overlay}
   */
  show() {

    // Make sure we're not hiding the overlay interface.
    this._container.hidden = false;

    // Allow chaining.
    return this;
  }

  /**
   *  Method to hide the overlay interface.
   *  @returns  {Overlay}
   */
  hide() {

    // Make sure we're hiding the overlay interface.
    this._container.hidden = true;

    // Allow chaining.
    return this;
  }

  /**
   *  Method to remove this object and clean up after itself.
   *  @returns  {Overlay}
   */
  remove() {

    // We didn't use any event listeners or other classes, so we can simply
    // remove the container from the DOM. But we do need to remove all
    // references to objects.
    this._container.remove();

    // Allow chaining.
    return this;
  }
}

// Export the Apology class so it can be imported elsewhere.
export { Apology };