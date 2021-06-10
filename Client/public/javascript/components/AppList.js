// Import dependencies.
import { Request } from "/javascript/tools/Request.js";
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Overview } from "/javascript/widgets/Overview.js";
import { goTo } from "/javascript/tools/goTo.js";
/**
 *  The definition of the AppList class component that can be used to load
 *  overview of created apps.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class AppList extends BaseElement {
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
   *  Reference to the request object.
   *  @var      {Request}
   */

  _request = null;
  /**
   *  Reference to the API request for the apps.
   *  @var      {Promise}
   */

  _requestPromise = null;
  /**
   *  Class constructor.
   *  @param    {Element}   parent      Container to which this component will
   *                                    be added.
   */

  constructor(parent) {
    // Call the base class constructor first.
    super(); // Create a container for this component.

    this._container = document.createElement("div");

    this._container.classList.add("applist", "component"); // Create a new request object.


    this._request = new Request(); // Create a app overview.

    this._overview = new Overview(this._container, {
      title: "App overview",
      center: true
    }); // First, request a list of all apps. Store the promise.

    this._requestPromise = this._request.get('/apps').catch(error => void this._overview.showError(error)).then(response => {
      // Get access to the JSON object.
      if (response) return response.json().then(apps => {
        // Use this component's error handling if an error has occurred with
        // the HTTP request.
        if (!response.ok) return this._overview.showError(apps.error); // Create a new cards object.

        const cards = {}; // Create an object to map app ids to their paths for navigation.

        const paths = {}; // Loop through all of the apps.

        for (const app of apps) {
          // Create a new card for each app.
          const card = this._overview.addCard({
            id: app._id,
            title: app.name,
            description: app.description,
            removable: true,
            editable: true,
            viewable: true
          }); // Add the card to our cards dictionary.


          cards[app._id] = card; // Remember the path for this app.

          paths[app._id] = app.path;
        } // Handle remove requests.


        this._overview.on('remove', id => {
          this._request.delete('/app/' + id).catch(error => void this._overview.showError(error)).then(response => {
            // If it was deleted from the database, we should remove it from
            // the overview as well.
            if (response.ok) cards[id].remove();
          });
        }); // Link the edit button to the edit form of the appropriate app.


        this._overview.on('edit', id => void goTo('/admin/app/' + id)); // Link the view button to the URL of the appropiate app.


        this._overview.on('view', id => void goTo('/app/' + paths[id]));
      });
    }); // Add the new element to the parent container.

    parent.appendChild(this._container);
  }
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */


  remove() {
    // Remove the Overview element once the request promise has resolved.
    if (this._requestPromise) this._requestPromise.then(() => void this._overview.remove()); // Call the BaseElement's remove function.

    super.remove();
  }

} // Export the AppList class so it can be imported elsewhere.


export { AppList };