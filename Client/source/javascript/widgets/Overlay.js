// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";

/**
 *  The definition of the Overlay class that can be used to create an overlay
 *  interface for a full screen video format. It can be used to any number of
 *  HTML elements to an overlay layout that is divided in a 'top' and 'bottom'
 *  part.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Overlay extends BaseElement {

  /**
   *  Private variable that stores a reference to the container positioned at
   *  the top of the overlay.
   *  @var      {Element}
   */
  _top = null;

  /**
   *  Private variable that stores a reference to the container positioned at
   *  the bottom of the overlay.
   *  @var      {Element}
   */
  _bottom = null;

  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element on which the
   *                                  overlay interface will be installed.
   */
  constructor(parent) {

    // Call the base class constructor.
    super();

    // Create a container for the overlay.
    this._container = document.createElement("div");
    this._container.classList.add("overlay");

    // Create a container for the top elements.
    this._top = document.createElement("section");
    this._top.classList.add("overlay-top");
    this._container.appendChild(this._top);

    // Create a container for the bottom elements.
    this._bottom = document.createElement("section");
    this._bottom.classList.add("overlay-bottom");
    this._container.appendChild(this._bottom);

    // Add the overlay to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Method for adding an element to the overlay.
   *  @param    {string}    type      What kind of element should this be? All
   *                                  valid HTML elements are accepted.
   *  @param    {object}    options   Object with options to initialize the
   *                                  element.
   *    @property {string}    text      Text to use in the element. Elements
   *                                    have no text by default.
   *    @property {string}    location  Where should this element be added?
   *                                    Valid options are 'top' and 'bottom'.
   *                                    'bottom' is the default option.
   *    @property {boolean}   animated  Should this element be animated when it
   *                                    is emptied or text is added?
   *  @returns  {Element}
   */
  add = (type, options = {}) => {

    // Create the new DOM element.
    const element = document.createElement(type);

    // If text was provided, we should add it to the element.
    if (options.text) element.textContent = options.text;

    // If it should be animated, add the animated class.
    if (options.animated) element.classList.add('animated');

    // If the 'top' location was specified, we should add this element to the
    // top of the overlay.
    if (options.location == 'top') this._top.appendChild(element);

    // Otherwise, we'll add the element to the bottom of the overlay.
    else this._bottom.appendChild(element);

    // Finally, return the element.
    return element;
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Remove all additional references to DOM elements we've stored.
    this._top.remove();
    this._bottom.remove();

    // Call the original remove method.
    super.remove();
  }
}

// Export the Overlay class so it can be imported elsewhere.
export { Overlay };