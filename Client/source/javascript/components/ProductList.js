// Import dependencies.
import { Request} from "/javascript/tools/Request.js";
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Overview } from "/javascript/widgets/Overview.js";
import { goTo } from "/javascript/tools/goTo.js";

/**
 *  The definition of the ProductList class component that can be used to load
 *  overview of created products.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class ProductList extends BaseElement {

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
    super();

    // Create a container for this component.
    this._container = document.createElement("div");
    this._container.classList.add("productlist", "component");

    // Create a new request object.
    this._request = new Request();

    // Create a product overview.
    this._overview = new Overview(this._container, {
      title: "Product overview",
      center: true,
    });

    // First, request a list of all products. Store the promise.
    this._requestPromise = this._request.get('/products')
      .catch(error => void this._overview.showError(error))
      .then(response => {

        // Get access to the JSON object.
        if (response) return response.json().then(products => {

          // Use this component's error handling if an error has occurred with
          // the HTTP request.
          if (!response.ok) return this._overview.showError(products.error);

          // Create a new cards object.
          const cards = {};

          // Loop through all of the products.
          for (const product of products) {

            // Create a new card for each product.
            const card = this._overview.addCard({
              id:           product._id,
              title:        product.name,
              description:  product.description,
              removable:    true,
              editable:     true,
              viewable:     false,
            });

            // Add the card to our cards dictionary.
            cards[product._id] = card;
          }

          // Handle remove requests.
          this._overview.on('remove', id => {
            this._request.delete('/product/' + id)
              .catch(error => void this._overview.showError(error))
              .then(response => {

                // If it was deleted from the database, we should remove it from
                // the overview as well.
                if (response.ok) cards[id].remove();
              });
          });

          this._overview.on('edit', id => void goTo('/admin/product/' + id));

          // Add the new element to the parent container.
          parent.appendChild(this._container);
        })
      });
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

// Export the ProductList class so it can be imported elsewhere.
export { ProductList };
