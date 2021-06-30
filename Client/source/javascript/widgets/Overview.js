// Import dependencies.
import { BaseElement } from "./BaseElement.js";
import { OverviewCard } from "./Overview/Card.js";
import { Title } from "./Title.js";
import { ErrorDisplay } from "./ErrorDisplay.js";
import { Button } from "./Button.js";

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
   *  Private variable that stores a reference to the title container.
   *  @var      {Element}
   */
  _titleContainer = null;

  /**
   *  Private variable that stores a reference to the error container.
   *  @var      {Element}
   */
  _errorContainer = null;

  /**
   *  Private variable that stores a reference to the buttons container.
   *  @var      {Element}
   */
  _buttonContainer = null;

  /**
   *  Private variable that stores a reference to the cards container.
   *  @var      {Element}
   */
  _cardContainer = null;

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
   *  Array of all the buttons that are listed in the overview.
   *  @var      {array}
   */
  _buttons = [];

  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element to which the overview
   *                                  will be added.
   *  @param    {object}    options   Optional parameters for instantiating the
   *                                  overview.
   *    @property   {array}   cards     Optional array of cards that are
   *                                    immediately added to the overview.
   *    @property   {array}   buttons   Optional array of buttons that are
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

    // Create separate containers for all elements.
    this._titleContainer = document.createElement("div");
    this._titleContainer.classList.add("title");
    this._errorContainer = document.createElement("div");
    this._errorContainer.classList.add("errors");
    this._buttonContainer = document.createElement("div");
    this._buttonContainer.classList.add("buttons");
    this._cardContainer = document.createElement("div");
    this._cardContainer.classList.add("cards");

    // Add the element containers to the component container.
    this._container.appendChild(this._titleContainer);
    this._container.appendChild(this._errorContainer);
    this._container.appendChild(this._buttonContainer);
    this._container.appendChild(this._cardContainer);

    // Add the title if requested.
    if (options.title) this.title(options.title);

    // Add an ErrorDisplay under the main title.
    this._errorDisplay = new ErrorDisplay(this._errorContainer);

    // Add the center class to the overview if requested.
    if (options.center) this._container.classList.add("center");

    // Add all provided buttons to the overview.
    if (options.buttons) for (const button of options.buttons) this.addButton(button);

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
      if (newTitle) this._title = new Title(this._titleContainer, { title: newTitle });
    }

    // Use the overview's title as the page title.
    document.getElementsByTagName("title")[0].textContent = newTitle;

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
    const card = new OverviewCard(this._cardContainer, options);

    // Add the card to the array.
    this._cards.push(card);

    // Propagate all of the card's events.
    card.bubbleTo(this);

    // Expose the card object.
    return card;
  }

  /**
   *  Method for adding a button element to the overview.
   *  @param    {object}    options   Optional parameters for the button that
   *                                  is added to the overview.
   *    @property   {string}    type      Button type.
   *    @property   {string}    label     Button text.
   *    @property   {boolean}   disabled  Is this button disabled?
   *    @property   {Function}  callback  The function that will called on
   *                                      click.
   *  @returns  {Button}
   */
  addButton = (options = {}) => {

    // Create a button element.
    const button = new Button(this._buttonContainer, options);

    // Install the callback as an on click event if provided.
    if (options.callback) button.on('click', options.callback);

    // Add the button to the array.
    this._buttons.push(button);

    // Propagate all of the button's events.
    button.bubbleTo(this);

    // Expose the button object.
    return button;
  }

  /**
   *  Method for showing errors.
   *  @param    {string|Error}      error   Error message.
   *  @returns  {Overview}
   */
  showError = error => {

    // If this is an Error object, we should extract the error message first.
    const message = error instanceof Error ? error.message : error;

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
    if (this._cards.length) for (const card of this._cards) card.remove();
    if (this._buttons.length) for (const button of this._buttons) button.remove();

    // Remove all references.
    this._title = null;
    this._cards = [];
    this._buttons = [];

    // Remove the DOM elements that we referenced.
    if (this._titleContainer) this._titleContainer.remove();
    if (this._errorContainer) this._errorContainer.remove();
    if (this._buttonContainer) this._buttonContainer.remove();
    if (this._cardContainer) this._cardContainer.remove();

    // Call the remove function for the base class. This will also remove the
    // container.
    super.remove();
  }
}

// Export the Overview class so it can be imported elsewhere.
export { Overview };
