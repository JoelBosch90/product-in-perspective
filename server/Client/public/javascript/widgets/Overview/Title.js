// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
/**
 *  The definition of the Title class that can be used to add a title to an
 *  overview.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class OverviewTitle extends BaseElement {
  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element to which the input
   *                                  element will be added.
   *  @param    {string}    title     The title text.
   */
  constructor(parent, title) {
    // First call the constructor of the base class.
    super(); // Create a container for the input element.

    this._container = document.createElement("h1"); // Use the label for the on hover title.

    this._container.textContent = title; // Add the input element to the parent element.

    parent.appendChild(this._container);
  }
  /**
   *  Method for updating the title text.
   *  @param    {string}    update    The new title text.
   *  @returns  {OverviewTitle}
   */


  update = update => {
    // Simply insert the new text.
    this._container.textContent = update; // Allow chaining;

    return this;
  };
} // Export the OverviewTitle class so it can be imported elsewhere.


export { OverviewTitle };