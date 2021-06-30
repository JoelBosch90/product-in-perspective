// Import dependencies.
import { Request} from "../tools/Request.js";
import { ProductForm } from "./ProductForm.js";
import { BaseElement } from "../widgets/BaseElement.js";
import { Overview } from "../widgets/Overview.js";
import { goTo } from "../tools/goTo.js";

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
   *  Reference to the button for adding a new model.
   *  @var      {Button}
   */
  _addButton = null;

  /**
   *  Class constructor.
   *  @param    {Element}   parent      Container to which this component will
   *                                    be added.
   */
  constructor(parent) {

    // Call the base class constructor first.
    super();

    // Create a container for this component.
    this._container = document.createElement("div");
    this._container.classList.add("modellist", "component");

    // Create a new request object.
    this._request = new Request();

    // Determine the overviews's title.
    const title = "Model overview";

    // Use the overview's title as the page title.
    this.pageTitle(title);

    // Create a model overview.
    this._overview = new Overview(this._container, {
      title,
      center: true,
      buttons: [{
        type:     'add',
        label:    'Add model',
        callback: () => void goTo('/admin/model/new'),
      }],
    });

    // First, request a list of all models. Store the promise.
    this._requestPromise = this._request.get('/models')
      .catch(error => void this._overview.showError(error))
      .then(response => {

        // Get access to the JSON object.
        if (response) return response.json().then(models => {

          // Use this component's error handling if an error has occurred with
          // the HTTP request.
          if (!response.ok) return this._overview.showError(models.error);

          // Create a new cards object.
          const cards = {};

          // Loop through all of the models.
          for (const model of models) {

            // Create a new card for each model.
            const card = this._overview.addCard({
              id:           model._id,
              title:        model.name,
              description:  model.description,
              removable:    true,
              editable:     true,
              viewable:     false,
            });

            // Add the card to our cards dictionary.
            cards[model._id] = card;
          }

          // Handle remove requests.
          this._overview.on('remove', id => {
            this._request.delete('/model/' + id)
              .catch(error => void this._overview.showError(error))
              .then(response => {

                // If it was not removed, we should not change anything yet.
                if (!response.ok) return;

                // If it was deleted from the database, we should remove it from
                // the overview as well.
                cards[id].remove();

                // We should clear the cache for the product form to update the
                // list of models you can select.
                this.trigger("clearCache", [ProductForm]);
              });
          });

          this._overview.on('edit', id => void goTo('/admin/model/' + id));
        })
      });

    // Add the new element to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Remove the Overview element once the request promise has resolved.
    if (this._requestPromise) this._requestPromise.then(() => void this._overview.remove());

    // Call the BaseElement's remove function.
    super.remove();
  }
}

// Export the ModelList class so it can be imported elsewhere.
export { ModelList };
