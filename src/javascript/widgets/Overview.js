// Import dependencies.
import { OverviewTitle } from "/javascript/widgets/Overview/Title.js";
import { OverviewCard } from "/javascript/widgets/Overview/Card.js";
import { BaseElement } from "/javascript/widgets/BaseElement.js";

/**
 *  The definition of the Overview class that can be used to create a overview
 *  element.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Overview extends BaseElement {

  /**
   *  Private variable that stores a reference to the OverviewTitle element if a
   *  title was added to the form.
   *  @var      {OverviewTitle}
   */
  _title = null;

  /**
   *  Array of all the cards that are listed in the overview.
   *  @var      {array}
   */
  _cards = [];

  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element to which the overview
   *                                  will be added.
   *  @param    {object}    options   Optional parameters for instantiating the
   *                                  overview.
   *    @property   {array}   cards     Optional array of cards that are
   *                                    immediately added to the overview.
   *    @property   {string}  title     Optional string for a title to add to
   *                                    the overview.
   *    @property   {boolean} center    Should this overview be centered in the
   *                                    parent element?
   *                                    Default: false.
   */
  constructor(parent, options = {}) {

    // Call the parent class's constructor.
    super();

    // Create a container for the overview.
    this._container = document.createElement("div");
    this._container.classList.add("overview");

    // Add the title if requested.
    if (options.title) this.title(options.title);

    // Add the center class to the overview if requested.
    if (options.center) this._container.classList.add("center");

    // Add all provided cards to the overview.
    if (options.cards) for (const card of options.cards) this.addCard(card.name, card.options);

    // Add the overview to the parent element.
    parent.appendChild(this._container);
  }

  /**
   *  Method for adding or update the title.
   *  @param    {string}    newTitle  Optional string for the title text. When
   *                                  no argument or an empty string is
   *                                  provided, the title will be removed.
   *  @returns  {Form}
   */
  title = (newTitle) => {

    // Do we already have a title component?
    if (this._title) {

      // Was a new title provided? Then we want to update the title component.
      if (newTitle) this._title.update(newTitle);

      // Was no new title provided? Then we can remove the title component.
      else this._title.remove();

    // Is there no title component yet?
    } else {

      // If a new title was provided, we should create the title component.
      if (newTitle) this._title = new OverviewTitle(this._container, newTitle);
    }

    // Allow chaining.
    return this;
  }

  /**
   *  Method for adding a card element to the overview.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the overview.
   *    @property   {string}  type      This is the type of card element.
   *    @property   {string}  label     This is the label of the element that
   *                                    will be shown to the user.
   *  @returns  {OverviewCard}
   */
  addCard = (options = {}) => {

    // Create a card element.
    const card = new OverviewCard(this._container, options);

    // Add the card to the array.
    this._cards.push(card);

    // Expose the card object.
    return card;
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Remove class objects we used.
    if (this._title) this._title.remove();
    if (this._cards) for (const card in this._cards) card.remove();

    // Remove all references.
    this._title = null;
    this._cards = [];

    // Call the remove function for the base class. This will also remove the
    // container.
    super.remove();
  }
}

// Export the Overview class so it can be imported elsewhere.
export { Overview };
