// Import dependencies.
import { BaseElement } from "../widgets/BaseElement.js";
import { Apology } from "../widgets/Apology.js";
import { Request } from "../tools/Request.js";
/**
 *  The definition of the Logout class component that can be used to log out.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class Logout extends BaseElement {
  /**
   *  Private variable that stores a reference to the container element in the
   *  DOM.
   *  @var      {Element}
   */
  _container = null;
  /**
   *  Private variable that stores the reference to the Request object.
   *  @var      {Request}
   */

  _request = null;
  /**
   *  Private variable that stores the reference to the Apology object.
   *  @var      {Apology}
   */

  _apology = null;
  /**
   *  Class constructor.
   *  @param    {Element}   parent      Container to which this component will
   *                                    be added.
   */

  constructor(parent) {
    // Call the base class constructor first.
    super(); // Create a container for this component.

    this._container = document.createElement("div"); // Show a brief message that we're logging out.

    this._apology = new Apology(this._container, "Logging out."); // We need to make an API call to log off so we need the Request object.

    this._request = new Request();

    this._request.get('/logout').catch(error => void this._apology.update("Error occurred: could not log out.")).then(response => {
      // If we get no response, something weird happened and we could not log
      // out.
      if (!response) return this._apology.update("Error occurred: could not log out."); // Move to the login page. Here we don't want to use our usual `goTo`
      // function as the `goTo` function prevents full page reloads. Since we
      // just logged out, we want a full page reload to clean up client-side
      // caching so that all artifacts from any previous sessions disappear.

      window.location.href = "/login";
    }); // Add the new element to the parent container.


    parent.appendChild(this._container);
  }
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */


  remove() {
    // Remove the Form element.
    this._form.remove(); // Call the BaseElement's remove function.


    super.remove();
  }

} // Export the Logout class so it can be imported elsewhere.


export { Logout };