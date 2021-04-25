// Import dependencies.
import { EventHandler } from "/javascript/EventHandler.js"
import { debounce } from "/javascript/debounce.js"

/**
 *  The definition of the ArScene class that can be used to create an an
 *  augmented reality session.
 *
 *  @event      end           Triggered when the augmented reality session has
 *                            ended.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class ArScene {

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
   *  Private variable that stores a reference to the overlay object.
   *  @var      {Overlay}
   */
  _overlay = null;

  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element on which the
   *                                  overlay interface will be installed.
   */
  constructor(parent) {

    // Create an event handler object to handle all events.
    this._eventHandler = new EventHandler();

    // Initialize the interface.
    this._initInterface();

    // Create a container for the overlay.
    this._container = document.createElement("div");
    this._container.classList.add("arscene");


    // Add the overlay to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Private method for initializing the DOM interface.
   *  @param    {Element}   parent    The parent element on which the
   *                                  barcode scanner interface will be
   *                                  installed.
   */
  _initInterface(parent) {

    // Create a container for the barcode scanner.
    this._container = document.createElement("div");

    // Add the styling class to the container element.
    this._container.classList.add("barcodescanner");

    // Create a container for the video element.
    const video = document.createElement("div");

    // Add the styling class to the container element.
    video.classList.add("barcodescanner-video");

    // Append the video container to the overall container.
    this._container.appendChild(video);

    // Create the overlay in this container.
    this._initOverlay(this._container);

    // Add the entire interface to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Private method for creating an overlay for the interface.
   *  @param    {Element}   parent    The parent element on which the overlay
   *                                  interface will be installed.
   */
  _initOverlay(parent) {

    // Create a container for the overlay element.
    const container = document.createElement("div");

    // Add the styling class to the container element.
    container.classList.add("barcodescanner-overlay");

    // Create an overlay object.
    this._overlay = new Overlay(container);

    // Add the overlay container to the parent container.
    parent.appendChild(container);
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

// Export the ArScene class so it can be imported elsewhere.
export { ArScene };