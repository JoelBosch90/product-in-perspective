// Import dependencies.
import { EventHandler } from "/javascript/EventHandler.js"

/**
 *  The definition of the Overlay class that can be used to create an overlay
 *  interface for a full screen video format. It can be used to add a title, a
 *  title description, buttons, and a button description to act as an interface.
 *
 *  This class can trigger custom events for click actions on buttons.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Overlay {

  /**
   *  Private variable that stores the event handler object.
   *  @var      {EventHandler}
   */
   _eventHandler = null;

   /**
    *  Private variable that stores a reference to the container element in the
    *  DOM.
    *  @var      {Element}
    */
   _container = null;

   /**
    *  Class constructor.
    *  @param    {Element}   parent    The parent element on which the
    *                                  overlay interface will be installed.
    */
   constructor(parent) {

     // Create an event handler object to handle all events.
     this._eventHandler = new EventHandler();

     // Create a container for the overlay.
     this._container = document.createElement("div");

     // Add the styling class to the container element.
     this._container.classList.add("overlay");

     this._container.textContent = "Hello World!";

     // Add the overlay to the parent container.
     parent.appendChild(this._container);
   }

   /**
    *  Method to show the overlay interface.
    *  @returns  {Overlay}
    */
   show() {

     // Make sure we're not hiding the overlay interface.
     this._container.hidden = false;

     // Allow chaining.
     return this;
   }

   /**
    *  Method to hide the overlay interface.
    *  @returns  {Overlay}
    */
   hide() {

     // Make sure we're hiding the overlay interface.
     this._container.hidden = true;

     // Allow chaining.
     return this;
   }

   /**
    *  Method for installing event handlers.
    *  @param    {...any}    args
    *  @returns  {Overlay}
    */
   on(...args) {

     // Pass everything to the event handler.
     this._eventHandler.on(...args);

     // Allow chaining.
     return this;
   }

   /**
    *  Method for removing event handlers.
    *  @param    {...any}    args
    *  @returns  {Overlay}
    */
   off(...args) {

     // Pass everything to the event handler.
     this._eventHandler.off(...args);

     // Allow chaining.
     return this;
   }
}

// Export the Overlay class so it can be imported elsewhere.
export { Overlay };