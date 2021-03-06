// Import dependencies.
import { BaseElement } from "../BaseElement.js";
import { Title } from "../Title.js";
import { Button } from "../Button.js";
import { Confirmation } from "../Confirmation.js";
/**
 *  The definition of the OverviewCard class that can be used to create card
 *  components to represent an object in an overview.
 *
 *  @event      remove            Triggered when the remove button is clicked.
 *  @event      edit              Triggered when the edit button is clicked.
 *  @event      view              Triggered when the view button is clicked.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class OverviewCard extends BaseElement {
  /**
   *  A private variable reference to the title element.
   *  @var    {Title}
   */
  _title = null;
  /**
   *  A private variable reference to the description element.
   *  @var    {Element}
   */

  _description = null;
  /**
   *  A private variable reference to the buttons container.
   *  @var    {Element}
   */

  _buttonContainer = null;
  /**
   *  A private array that keeps track of our buttons.
   *  @var    {array}
   */

  _buttons = [];
  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element to which the input
   *                                  element will be added.
   *  @param    {object}    options   Parameters for the card widget.
   *    @property   {string}  id            String that uniquely identifies the
   *                                        object this card represents.
   *    @property   {string}  title         Title to install on the card.
   *    @property   {string}  description   Description to install on the card.
   *    @property   {array}   buttons       An array of options for buttons to
   *                                        add to the card.
   *    @property   {boolean} removable     Should we add a remove button?
   *    @property   {boolean} editable      Should we add an edit button?
   *    @property   {boolean} viewable      Should we add a view button?
   */

  constructor(parent, options = {}) {
    // First call the constructor of the base class.
    super(); // Create a container for the card.

    this._container = document.createElement("div");

    this._container.classList.add("card"); // We always want to add the title and the description, even if they contain
    // no text.


    this.title(options.title);
    this.description(options.description); // Should we add a view button?

    if (options.viewable) {
      this.addButton({
        label: "View",
        type: "default" // Trigger an event that communicates that the user wants to view.

      }).on("click", () => void this.trigger("view", options.id));
    } // Should we add an edit button?


    if (options.editable) {
      this.addButton({
        label: "Edit",
        type: "default" // Trigger an event that communicates that the user wants to edit.

      }).on("click", () => void this.trigger("edit", options.id));
    } // Should we add a remove button?


    if (options.removable) {
      this.addButton({
        label: "Remove",
        type: "remove" // Trigger an event that communicates that the user wants to remove.

      }).on("click", () => void this._removeHandler(options.id));
    } // Install the other options.


    if (options.buttons) for (const button of options.buttons) this.addButton(button); // Add the card to the parent container.

    parent.appendChild(this._container);
  }
  /**
   *  Private method to double check with the user before triggering the remove
   *  event.
   *  @param    {string}    id          The id of the item that the user wants
   *                                    removed.
   */


  _removeHandler = id => {
    // Create a new confirmation element to ask the user to confirm their
    // choice.
    const confirmation = new Confirmation({
      title: "Are you sure you want to remove this item?",
      description: "You are about to permanently remove this item. This action is irreversible."
    }); // Add a button to confirm.

    confirmation.addButton({
      label: "Yes",
      type: "confirm"
    }).on("click", () => {
      // Remove the confirmation.
      confirmation.remove(); // Trigger the actual remove event.

      this.trigger("remove", id);
    }); // Add a button to cancel.

    confirmation.addButton({
      label: "No",
      type: "cancel"
    }).on("click", () => void confirmation.remove());
  };
  /**
   *  Method for installing or updating the card's title.
   *  @param    {string}    newTitle    The new title to install.
   *  @returns  {OverviewCard}
   */

  title = newTitle => {
    // If there is no title element yet, we should first install it.
    if (!this._title) this._title = new Title(this._container, {
      type: 'h2'
    }); // Update the title if we have one.

    if (newTitle) this._title.update(newTitle); // Allow chaining.

    return this;
  };
  /**
   *  Method for installing or updating the card's description.
   *  @param    {string}    newDescription    The new description to install.
   *  @returns  {OverviewCard}
   */

  description = newDescription => {
    // If there is no description element yet, we should first install it.
    if (!this._description) {
      // Create a description element and add it to the container.
      this._description = document.createElement("p");

      this._container.appendChild(this._description);
    } // Update the description if we have one.


    if (newDescription) this._description.textContent = newDescription; // Allow chaining.

    return this;
  };
  /**
   *  Method for add a button to the card.
   *  @param    {object}    options       Button options.
   *  @returns  {Button}
   */

  addButton = options => {
    // If there is no buttons container yet, we should first create one.
    if (!this._buttonContainer) {
      // Create a buttons container and add it to the main container.
      this._buttonContainer = document.createElement("div");

      this._buttonContainer.classList.add("buttons");

      this._container.appendChild(this._buttonContainer);
    } // Create the new button.


    const button = new Button(this._buttonContainer, options); // Add it to our array of buttons.

    this._buttons.push(button); // Expose the button.


    return button;
  };
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */

  remove() {
    // Remove all class objects we've created.
    if (this._title) this._title.remove();
    if (this._buttons) for (const button of this._buttons) button.remove(); // Remove DOM elements.

    if (this._description) this._description.remove();
    if (this._buttonContainer) this._buttonContainer.remove(); // Reset the buttons array.

    this._buttons = []; // Call the original remove method. This also removes the container.

    super.remove();
  }

} // Export the OverviewCard class so it can be imported elsewhere.


export { OverviewCard };