// Import dependencies.
import { Request } from "/javascript/tools/Request.js";
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Overview } from "/javascript/widgets/Overview.js";
import { goTo } from "/javascript/tools/goTo.js";
/**
 *  The definition of the ModelList class component that can be used to load
 *  overview of created models.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class ModelList extends BaseElement {
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

    this._container.classList.add("modellist"); // Create a new request object.


    this._request = new Request(); // Create a model overview.

    this._overview = new Overview(this._container, {
      title: "Model overview",
      center: true
    }); // First, request a list of all models. Store the promise.

    this._requestPromise = this._request.get('/models').catch(this._overview.showError).then(response => {
      // Get access to the JSON object.
      if (response) return response.json().then(models => {
        // Use this component's error handling if an error has occurred with
        // the HTTP request.
        if (!response.ok) return this._overview.showError(models.error); // Create a new cards object.

        const cards = {}; // Loop through all of the models.

        for (const model of models) {
          // Create a new card for each model.
          const card = this._overview.addCard({
            id: model._id,
            title: model.name,
            description: model.description,
            removable: true,
            editable: true,
            viewable: false
          }); // Add the card to our cards dictionary.


          cards[model._id] = card;
        } // Handle remove requests.


        this._overview.on('remove', id => {
          this._request.delete('/model/' + id).catch(this._overview.showError).then(response => {
            // If it was deleted from the database, we should remove it from
            // the overview as well.
            if (response.ok) cards[id].remove();
          });
        });

        this._overview.on('edit', id => void goTo('/admin/model/' + id)); // Add the new element to the parent container.


        parent.appendChild(this._container);
      });
    });
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

} // Export the ModelList class so it can be imported elsewhere.


export { ModelList };