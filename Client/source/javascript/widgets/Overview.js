// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { OverviewCard } from "/javascript/widgets/Overview/Card.js";
import { Title } from "/javascript/widgets/Title.js";
import { ErrorDisplay } from "/javascript/widgets/ErrorDisplay.js";

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
   *  Private variable that stores a reference to the Title element if a
   *  title was added to the form.
   *  @var      {Title}
   */
  _title = null;

  /**
   *  Element that displays error messages.
   *  @var      {ErrorDisplay}
   */
  _errorDisplay = null;

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

    // Add an ErrorDisplay under the main title.
    this._errorDisplay = new ErrorDisplay(this._container);

    // Add the center class to the overview if requested.
    if (options.center) this._container.classList.add("center");

    // Add all provided cards to the overview.
    if (options.cards) for (const card of options.cards) this.addCard(card);

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
      if (newTitle) this._title = new Title(this._container, { title: newTitle });
    }

    // Allow chaining.
    return this;
  }

  /**
   *  Method for adding a card element to the overview.
   *  @param    {object}    options   Optional parameters for the element that
   *                                  is added to the overview.
   *    @property   {string}  id            String that uniquely identifies the
   *                                        object this card represents.
   *    @property   {string}  title         Title to install on the card.
   *    @property   {string}  description   Description to install on the card.
   *    @property   {array}   buttons       An array of options for buttons to
   *                                        add to the card.
   *    @property   {boolean} removable     Should we add a remove button?
   *    @property   {boolean} editable      Should we add an edit button?
   *    @property   {boolean} viewable      Should we add a view button?
   *  @returns  {OverviewCard}
   */
  addCard = (options = {}) => {

    // Create a card element.
    const card = new OverviewCard(this._container, options);

    // Add the card to the array.
    this._cards.push(card);

    // Propagate all of the card's events.
    card.bubbleTo(this);

    // Expose the card object.
    return card;
  }

  /**
   *  Method for showing errors.
   *  @param    {string|Error}      error   Error message.
   *  @returns  {Overview}
   */
  showError = error => {

    // If this is an Error object, we should extract the error message first.
    const message = error instanceof Error ? error.message : error;

    console.log(message);

    // Clear the error display to show the new error.
    this._errorDisplay.clear().add(message);

    // Allow chaining.
    return this;
  }


  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Remove class objects we used.
    if (this._title) this._title.remove();
    if (this._cards) for (const card of this._cards) card.remove();

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
