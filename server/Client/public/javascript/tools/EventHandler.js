/**
 *  The definition of the EventHandler class that can trigger events. It
 *  features three different methods:
 *
 *    on        -   Is used to register an event listener. This method adds a
 *                  callback function to the _triggers variable for this event.
 *    off       -   Is used to remove an event listener. This method remove a
 *                  callback function from the _triggers variable for this
 *                  event.
 *    trigger   -   Is used to register an event. It can be provided with extra
 *                  data that is passed into the callback functions that are
 *                  registered in the _triggers variable for this event.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class EventHandler {
  /**
   *  Private variable for event triggers.
   *  @var      object
   */
  _triggers = {};
  /**
   *  Private variable that keeps track of other EventHandler object that should
   *  trigger the same events.
   *  @var    {array}
   */

  _bubbleTo = [];
  /**
   *  Class constructor.
   */

  constructor() {}
  /**
   *  Method for triggering an event. This method will execute all callback
   *  functions that are registered in the _triggers variable and optionally
   *  pass the provided data to those functions.
   *  @param    {string}        event       Name of the event.
   *  @param    {object}        data        Data to be passed to the callbacks
   *                                        for this event.
   *  @returns  {EventHandler}
   */


  trigger = (event, data) => {
    // We only know how to handle string events.
    if (!typeof event == "string") return this; // Execute each registered callback function for this event.

    if (this._triggers[event]) this._triggers[event].forEach(listener => void listener(data)); // Trigger the same event on all other handlers we want to bubble to.

    if (this._bubbleTo) for (const handler of this._bubbleTo) handler.trigger(event, data); // Allow chaining;

    return this;
  };
  /**
   *  Method that propagates all events to a different EventHandler object.
   *  @param    {EventHandler}  EventObject
   *  @returns  {EventHandler}
   */

  bubbleTo = handler => {
    // We only know how to handle EventHandler objects.
    if (!handler instanceof EventHandler) return this; // Add this EventHandler to the bubbleTo list.

    this._bubbleTo.push(handler); // Allow chaining;


    return this;
  };
  /**
   *  Method that stops propagating all events to the specified EventHandler
   *  object.
   *  @param    {EventHandler}  EventObject
   *  @returns  {EventHandler}
   */

  bubbleOff = handler => {
    // We only know how to handle EventHandler objects.
    if (!handler instanceof EventHandler) return this; // Remove this EventHandler from the bubbleTo list.

    this._bubbleTo = this._bubbleTo.filter(bubbled => bubbled != handler); // Allow chaining;

    return this;
  };
  /**
   *  Method for storing event listeners per event. It will store the callbacks
   *  in separate arrays per event so that they can be triggered separately.
   *  @param    {string}        event       Name of the event.
   *  @param    {function}      listener    Function that should be called when
   *                                        the event happens.
   *  @returns  {EventHandler}
   */

  on = (event, listener) => {
    // We only know how to handle string events.
    if (!typeof event == "string") return this; // If no listeners exist for this event, create an array to house them.

    if (this._triggers[event] == undefined) this._triggers[event] = []; // Add this callback to the list for this event.

    this._triggers[event].push(listener); // Allow chaining;


    return this;
  };
  /**
   *  Method for removing event listeners per event. It will remove the callback
   *  from the array of callbacks that is currently stored for this event.
   *  @param    {string}        event       Name of the event.
   *  @param    {function}      listener    Function that should be called when
   *                                        the event happens.
   *  @returns  {EventHandler}
   */

  off = (event, listener) => {
    // We only know how to handle string events.
    if (!typeof event == "string") return this; // If there are no callbacks registered for this event, there is no need to
    // remove one.

    if (this._triggers[event] == undefined) return this; // If callbacks are registered for this event, make sure that this callback
    // is filtered from that array.

    this._triggers[event] = this._triggers[event].filter(item => item !== listener); // Allow chaining;

    return this;
  };
  /**
   *  Method to remove this object and clean up after itself.
   */

  remove() {
    // Delete the triggers object.
    this._triggers = {}; // Reset the bubbled array.

    this._bubbled = [];
  }

} // Export the EventHandler class so it can be imported elsewhere.


export { EventHandler };