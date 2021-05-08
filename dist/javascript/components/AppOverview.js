// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Overview } from "/javascript/widgets/Overview.js";
/**
 *  The definition of the AppOverview class component that can be used to load
 *  overview of created apps.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class AppOverview extends BaseElement {
  /**
   *  Private variable that stores a reference to the container element in the
   *  DOM.
   *  @var      {Element}
   */
  _container = null;
  /**
   *  Private variable that stores a reference to the Overview element.
   *  @var      {Overview}
   */

  _overview = null;
  /**
   *  Class constructor.
   *  @param    {Element}   parent      Container to which this component will
   *                                    be added.
   *  @param    {array}     options
   */

  constructor(parent, options = {}) {
    // Call the base class constructor first.
    super(); // Create a container for this component.

    this._container = document.createElement("div"); // Create a app overview.

    this._overview = new Overview(this._container, {
      title: "Overview",
      center: true,
      cards: [{
        title: "AppName1",
        description: "AppDescription1"
      }, {
        title: "AppName2",
        description: "AppDescription2"
      }, {
        title: "AppName3",
        description: "AppDescription3"
      }, {
        title: "AppName4",
        description: "AppDescription4"
      }]
    }); // Add the new element to the parent container.

    parent.appendChild(this._container);
  }
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */


  remove() {
    // Remove the Overview element.
    this._overview.remove(); // Call the BaseElement's remove function.


    super.remove();
  }

} // Export the AppOverview class so it can be imported elsewhere.


export { AppOverview };