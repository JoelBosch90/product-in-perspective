// Import dependencies
import { EventHandler } from "/javascript/tools/EventHandler.js";

/**
 *  The definition of the BaseElement class that can be used as a base for any
 *  class that is based on a DOM element.
 *
 *    show      -   Is used to show the main container.
 *    hide      -   Is used to hide the main container.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class BaseElement extends EventHandler {

  /**
   *  Private variable that stores a reference to the container element in the
   *  DOM.
   *  @var      {Element}
   */
  _container = null;

  /**
   *  Method to show this element.
   *  @returns  {BaseElement}
   */
  show = () => {

    // Make sure we're not hiding.
    this._container.removeAttribute('hidden');

    // Allow chaining.
    return this;
  }

  /**
   *  Method to hide this element.
   *  @returns  {BaseElement}
   */
  hide = () => {

    // Make sure we're hiding.
    this._container.setAttribute('hidden', '');

    // Allow chaining.
    return this;
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Remove the container if it was ever initialized.
    if (this._container) this._container.remove();

    // Call the EventHandler's remove function.
    super.remove();
  }
}

// Export the BaseElement class so it can be imported elsewhere.
export { BaseElement };
