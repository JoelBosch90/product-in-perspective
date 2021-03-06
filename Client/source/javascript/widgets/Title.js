// Import dependencies.
import { BaseElement } from "../widgets/BaseElement.js";

/**
 *  The definition of the Title class that can be used to add a title to another
 *  element.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Title extends BaseElement {

  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element to which the input
   *                                  element will be added.
   *  @param    {object}    options
   *    @property   {string}  type    Optional parameter for changing the header
   *                                  type.
   *    @property   {string}  title   Optional title text to install. This can
   *                                  also be after the fact with the update
   *                                  method.
   */
  constructor(parent, options) {

    // First call the constructor of the base class.
    super();

    // Create a container for the title element.
    this._container = document.createElement(options.type || "h1");

    // Use the label for the on hover title.
    if (options.title) this._container.textContent = options.title;

    // Add the title element to the parent element.
    parent.appendChild(this._container);
  }

  /**
   *  Method for updating the title text.
   *  @param    {string}    update    The new title text.
   *  @returns  {Title}
   */
  update = (update) => {

    // Simply insert the new text.
    this._container.textContent = update;

    // Allow chaining;
    return this;
  }
}

// Export the Title class so it can be imported elsewhere.
export { Title };
