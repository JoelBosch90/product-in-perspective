// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Representation } from "/javascript/widgets/Representation.js";
/**
 *  The definition of the App class component that can be used to load single
 *  product preview app.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class App extends BaseElement {
  /**
   *  Private variable that stores a reference to the container element in the
   *  DOM.
   *  @var      {Element}
   */
  _container = null;
  /**
   *  Class constructor.
   *  @param    {Element}   parent      Container to which this component will
   *                                    be added.
   *  @param    {array}     options     Parameters.
   *    @property {string}    appPath     The path that identifies the app that
   *                                      we should shown.
   */

  constructor(parent, options = {}) {
    // Call the base class constructor first.
    super(); // Create a container for this component.

    this._container = document.createElement("div");

    this._container.classList.add("app"); // Create a new representation object that allows a user to scan a product
    // and view a representation for that product in an augmented reality scene.


    this._representation = new Representation(this._container, options); // Listen for errors.

    this._representation.on("error", this._errorHandler); // Add the new element to the parent container.


    parent.appendChild(this._container);
  }
  /**
   *  Private method for handling errors.
   *  @param    {Error}     error   Object describing the error that has
   *                                occurred.
   *  @TODO     Implement user friendly error handling.
   */


  _errorHandler = error => {
    // For now we want to simply log the error.
    console.error(error);
  };
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */

  remove() {
    // Remove the Representation object.
    this._representation.remove(); // Call the BaseElement's remove function.


    super.remove();
  }

} // Export the App class so it can be imported elsewhere.


export { App };