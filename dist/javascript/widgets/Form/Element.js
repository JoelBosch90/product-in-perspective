// Import dependencies.
import { EventHandler } from "/javascript/widgets/EventHandler.js";
/**
 *  The definition of the Element class that can be used to create any form
 *  elements.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class FormElement {
  /**
   *  Private variable that stores the event handler object that can handle all
   *  events.
   *  @var      {EventHandler}
   */
  _eventHandler = null;
  /**
   *  Private variable that stores a reference to the container element in the
   *  DOM.
   *  @var      {Element}
   */

  _container = null; // This is more of an abstract class and we don't need the constructor here.

  constructor() {
    // Create a new event handler.
    this._eventHandler = new EventHandler();
  }
  /**
   *  Method to trigger an event on this element.
   *  @param    {string}    event     Name of the event that is triggered.
   *  @param    {Any}       data      Data that will be provided to the
   *                                  listeners.
   */


  trigger = (event, data) => {
    // Use the event handler object to trigger the event.
    this._eventHandler.trigger(event, data);
  };
  /**
   *  Method to show this element.
   *  @returns  {FormElement}
   */

  show = () => {
    // Make sure we're not hiding.
    this._container.classList.remove("hidden"); // Allow chaining.


    return this;
  };
  /**
   *  Method to hide this element.
   *  @returns  {FormElement}
   */

  hide = () => {
    // Make sure we're hiding..
    this._container.classList.add("hidden"); // Allow chaining.


    return this;
  };
  /**
   *  Method for installing event handlers.
   *  @param    {...any}    args
   *  @returns  {FormElement}
   */

  on = (...args) => {
    // Pass everything to the event handler.
    this._eventHandler.on(...args); // Allow chaining.


    return this;
  };
  /**
   *  Method for removing event handler.
   *  @param    {...any}    args
   *  @returns  {FormElement}
   */

  off = (...args) => {
    // Pass everything to the event handler.
    this._eventHandler.off(...args); // Allow chaining.


    return this;
  };
  /**
   *  Method to remove this object and clean up after itself.
   *  @returns  {FormElement}
   */

  remove = () => {
    // Remove class objects we used.
    this._eventHandler.remove(); // Remove all DOM elements we've stored.


    if (this._container) this._container.remove(); // Allow chaining.

    return this;
  };
} // Export the FormElement class so it can be imported elsewhere.


export { FormElement };