// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
/**
 *  The definition of the OverviewCard class that can be used to create card
 *  components to represent an object in an overview.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class OverviewCard extends BaseElement {
  /**
   *  A private variable reference to the input element.
   *  @var    {Element}
   */
  _coontainer = null;
  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element to which the input
   *                                  element will be added.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the form.
   *    @property   {string}  name      Registration name of the input. This is
   *                                    also used in the API call and should
   *                                    uniquely identify the input.
   *    @property   {string}  type      This is the type of the input that is
   *                                    added.
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   *    @property   {array}   options   An array of options to add to the select
   *                                    element. This is only used when the
   *                                    type is 'select'.
   */

  constructor(parent, options = {}) {
    // First call the constructor of the base class.
    super(); // Create a container for the card.

    this._container = document.createElement("div");

    this._container.classList.add("card"); // Add the card to the parent container.


    parent.appendChild(this._container);
  }
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */


  remove() {
    // Call the original remove method. This also removes the container.
    super.remove();
  }

} // Export the OverviewCard class so it can be imported elsewhere.


export { OverviewCard };