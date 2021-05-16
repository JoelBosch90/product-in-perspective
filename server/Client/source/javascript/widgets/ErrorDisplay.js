// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";

/**
 *  The definition of the ErrorDisplay class that can be used to show error
 *  messages.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class ErrorDisplay extends BaseElement {

  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element to which the button
   *                                  element will be added.
   */
  constructor(parent) {

    // First call the constructor of the base class.
    super();

    // Create a container for the button element.
    this._container = document.createElement("div");
    this._container.classList.add("error-display");

    // Add the button element to the parent element.
    parent.appendChild(this._container);
  }

  /**
   *  Method to add an error to the bus.
   *  @param    {string}        error     Error message that is to be displayed.
   *  @returns  {ErrorDisplay}
   */
  add = error => {

    // We don't know how to deal with anything other than strings at this point.
    if (typeof error != "string") return;

    // Create a paragraph.
    const p = document.createElement("p");

    // Install the error text.
    p.textContent = "Error: " + error.toLowerCase();

    // Add the error to the display.
    this._container.appendChild(p);

    // Allow chaining.
    return this;
  }

  /**
   *  Removes all errors and resets the display.
   *  @returns  {ErrorDisplay}
   */
  clear = () => {

    // Remove all child nodes from the container.
    while (this._container.firstChild) this._container.firstChild.remove();

    // Allow chaining.
    return this;
  }

  /**
   *  Method to remove this object and clean up after itself.
   */
  remove = () => {

    // Then let the parent element clean up the container.
    super.remove();
  }
}

// Export the ErrorDisplay class so it can be imported elsewhere.
export { ErrorDisplay };
