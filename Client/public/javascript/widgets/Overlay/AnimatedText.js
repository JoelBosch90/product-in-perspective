// Import dependencies.
import { BaseElement } from "../BaseElement.js";
/**
 *  The definition of the AnimatedText class that can be used to create a text
 *  element that is animated every time the text is changed.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class AnimatedText extends BaseElement {
  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element on which the
   *                                  overlay interface will be installed.
   *  @property {string}    text      Text to use as button context. Elements
   *                                    have no text by default.
   */
  constructor(parent, text) {
    // Call the base class constructor.
    super(); // Create a container for the overlay.

    this._container = document.createElement("p");

    this._container.classList.add("animated-text");

    this._container.add("empty"); // Add the overlay to the parent container.


    parent.appendChild(this._container);
  }
  /**
   *  Method for adding an element to the overlay.
   *  @param    {string}    type      What kind of element should this be? All
   *                                  valid HTML elements are accepted.
   *  @param    {object}    options   Object with options to initialize the
   *                                  button.
   *    @property {string}    text      Text to use as button context. Elements
   *                                    have no text by default.
   *    @property {string}    location  Where should this button be added? Valid
   *                                    options are 'top' and 'bottom'. 'bottom'
   *                                    is the default option.
   *  @returns  {Element}
   */


  update = (type, options = {}) => {
    // Create the new DOM element.
    const element = document.createElement(type); // If text was provided, we should add it to the element.

    if (options.text) element.textContent = options.text; // If the 'top' location was specified, we should add this element to the
    // top of the overlay.

    if (options.location == 'top') this._top.appendChild(element); // Otherwise, we'll add the element to the bottom of the overlay.
    else this._bottom.appendChild(element); // Finally, return the element.

    return element;
  };
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */

  remove() {
    // Remove all additional references to DOM elements we've stored.
    this._top.remove();

    this._bottom.remove(); // Call the original remove method.


    super.remove();
  }

} // Export the AnimatedText class so it can be imported elsewhere.


export { AnimatedText };