// Import dependencies.
import { EventHandler } from "/javascript/EventHandler.js";

/**
 *  The definition of the HitTest class that can be used to perform a WebXR hit
 *  test.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class HitTest {

  /**
   *  Private variable that stores the event handler object.
   *  @var      {EventHandler}
   */
  _eventHandler = new EventHandler();

  /**
   *  Class constructor.
   *  @param    {???}       renderer  ???
   *  @param    {object}    options   Optional option parameters.
   */
   constructor(renderer, options) {

    // Create an event handler object to handle all events.
    this._eventHandler = new EventHandler();

  }

  /**
   *  Method to remove this object and clean up after itself.
   *  @returns  {HitTest}
   */
   remove() {

    // Remove the event handler object.
    this._eventHandler.remove();


    // Allow chaining.
    return this;
  }
}

// Export the HitTest class so it can be imported elsewhere.
export { HitTest };