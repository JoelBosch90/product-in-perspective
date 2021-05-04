// Import dependencies.
import { EventHandler } from "/javascript/EventHandler.js";
import { Overlay } from "/javascript/Overlay.js";
import { Reticle } from "/javascript/ArScene/Reticle.js";
import { debounce } from "/javascript/debounce.js";
/**
 *  The definition of the ArScene class that can be used to create an an
 *  augmented reality session.
 *
 *  @event      end           Triggered when the augmented reality session has
 *                            ended.
 *  @event      error         Triggered when an unrecoverable error has
 *                            occurred.
 *  @event      loaded        Triggered when the scene has loaded and can be
 *                            started.
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
  _eventHandler = new EventHandler();
  /**
   *  Private variable that stores a reference to the container element in the
   *  DOM.
   *  @var      {Element}
   */

  _container = null;
  /**
   *  Private variable that keeps track of the current mode of the scene. We
   *  always start out in inactive mode.
   *  Valid values are: "inactive", "placing", and "viewing"
   *  @var      {string}
   */

  _mode = "inactive";
  /**
   *  Private variable that stores a reference to the Aframe scene.
   *  @var      {Element}
   */

  _scene = null;
  /**
   *  Private variable that stores a reference to the Aframe reticle.
   *  @var      {Reticle}
   */

  _reticle = null;
  /**
   *  Private variable that stores a reference to the Aframe 3D object.
   *  @var      {Element}
   */

  _object = null;
  /**
   *  Private variable that stores a reference to the Overlay object.
   *  @var      {Overlay}
   */

  _overlay = null;
  /**
   *  Private variable that stores a reference to the container that houses the
   *  overlay.
   *  @var      {Element}
   */

  _overlayContainer = null;
  /**
   *  Private variable that stores a reference to the container that houses the
   *  augmented reality interface that we can attach the overlay to.
   *  @var      {Element}
   */

  _interface = null;
  /**
   *  Private variable that stores a reference to the proceed button.
   *  @var      {Element}
   */

  _proceedButton = null;
  /**
   *  Private variable that stores a reference to the stop button.
   *  @var      {Element}
   */

  _stopButton = null;
  /**
   *  Private variable that stores a reference to the instructions element.
   *  @var      {Element}
   */

  _instructions = null;
  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element on which the
   *                                  overlay interface will be installed.
   */

  constructor(parent) {
    // Create an event handler object to handle all events.
    this._eventHandler = new EventHandler(); // Initialize the interface.

    this._initInterface(parent);
  }
  /**
   *  Private method for initializing the DOM interface.
   *  @param    {Element}   parent    The parent element on which the overlay
   *                                  and the scene will be installed.
   */


  _initInterface(parent) {
    // Create a container for the barcode scanner.
    this._container = document.createElement("div");

    this._container.classList.add("arscene"); // Create the overlay in this container.


    this._createOverlay(this._container); // Create the scene in this container.


    this._createScene(this._container); // Make sure that all interface elements are initially hidden.


    this.hide(); // Add the entire interface to the parent container.

    parent.appendChild(this._container);
  }
  /**
   *  Private method for creating an Aframe scene for augmented reality.
   *  @param    {Element}   parent    The parent element on which the scene will
   *                                  be installed.
   */


  _createScene(parent) {
    // Create the Aframe scene element.
    this._scene = document.createElement("a-scene");

    this._scene.classList.add("arscene-scene");

    this._scene.setAttribute("visible", "false"); // Disable the custom UI that Aframe adds onto the scene. We should provide
    // our own button for entering AR.


    this._scene.setAttribute("vr-mode-ui", "enabled: false"); // Make sure we can have access to the hit test feature, attach the overlay,
    // and initialize the AR session at the user's feet.


    this._scene.setAttribute("webxr", "optionalFeatures: hit-test, local-floor, dom-overlay; overlayElement: .arscene-overlay;"); // Add a reticle to the scene.


    this._reticle = new Reticle(this._scene); // Add a 3D object to the scene.

    this._insertObject(this._scene); // Add the overlay to the scene.


    this._addOverlayToScene(this._scene); // Add the scene to the parent container.


    parent.prepend(this._scene); // Check to see if the renderer has already started. If so, we can
    // immediately initialize the scene.

    if (this._scene.renderStarted) this._initScene(); // Otherwise, we need to wait for the scene element to load first.
    else this._scene.addEventListener("loaded", () => void this._initScene());
  }
  /**
   *  Private method for initializing the scene by adding event listeners and
   *  triggering the loaded event.
   */


  _initScene() {
    // Add an event listener to the scene to detect when the user has exited the
    // scene.
    this._scene.addEventListener("exit-vr", () => void this.stop()); // Add an event listener to the scene to detect when the user has entered
    // the scene.


    this._scene.addEventListener("enter-vr", () => void this._activateScene()); // Announce that the scene has finished loading.


    this._eventHandler.trigger("loaded");
  }
  /**
   *  Method to activate the augmented reality scene.
   */


  _activateScene() {
    // Did we end up in virtual reality mode?
    if (this._scene.is("vr-mode")) return this._handleError("VR mode is not yet implemented."); // Did we fail to get to augmented reality mode?

    if (!this._scene.is("ar-mode")) return this._handleError("Could not enter augmented reality mode."); // Do we have a DOM overlay?

    const domOverlay = !!(this._scene.xrSession.domOverlayState && this._scene.xrSession.domOverlayState.type); // Mount the overlay in the augmented reality session.

    this._overlayContainer.setAttribute('text', 'value', 'Overlay: ' + domOverlay); // Make sure the overlay is visible.


    this._overlayContainer.setAttribute('visible', 'true'); // Make sure the augmented reality scene is visible.


    this._scene.setAttribute('visible', 'true'); // Go to placing mode.


    this._placingMode();
  }
  /**
   *  Private method for handling errors.
   *  @param    {string}    message A message explaining what went wrong.
   */


  _handleError(message) {
    // Trigger the error event.
    this._eventHandler.trigger("error", message);
  }
  /**
   *  Private method for loading the assets in the scene.
   *  @param    {Element}   scene   The Aframe scene to which the object is
   *                                added.
   *
   *  @TODO     Get the assets from an API call.
   */


  _loadAssets(scene) {
    // Create an element for the list of assets.
    const assets = document.createElement("a-assets"); // Some of our models might take a while to load, so we need to increase the
    // timeout.

    assets.setAttribute("timeout", "5000"); // Add the 3D model to the list of assets.
    // Currently using this example:
    // https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/Duck

    const model = document.createElement("a-asset-item");
    model.setAttribute("src", "/models/duck/Duck.gltf");
    model.id = "arscene-model"; // Add all assets to the list.

    assets.appendChild(model); // Add the assets to the scene.

    scene.appendChild(assets);
  }
  /**
   *  Private method for adding an object in an Aframe scene.
   *  @param    {Element}   scene   The Aframe scene to which the object is
   *                                added.
   */


  _insertObject(scene) {
    // First, load the assets.
    this._loadAssets(scene); // Create an Aframe box element.


    this._object = document.createElement("a-gltf-model");

    this._object.classList.add("arscene-object"); // Attach a relevant default model with sensible dimensions.


    this._object.setAttribute("src", "#arscene-model");

    this._object.setAttribute("scale", "0.1 0.1 0.1"); // It should be hidden until it is placed in the scene by the user.


    this._object.setAttribute("visible", "false"); // Add the object to the scene.


    scene.appendChild(this._object);
  }
  /**
   *  Private method for adding a interface in an Aframe scene. This interface
   *  is an object in augmented reality that is attached to the camera view that
   *  we can attach the overlay to.
   *  @param    {Element}   scene   The Aframe scene to which the interface is
   *                                added.
   */


  _addOverlayToScene(scene) {
    // Create an Aframe camera element. To add the overlay to the scene, we can
    // create an interface in a camera object that we can mount the overlay to.
    const camera = document.createElement("a-camera"); // Create an Aframe entity element for the interface.

    this._interface = document.createElement("a-entity");

    this._interface.classList.add("arscene-interface");

    this._interface.setAttribute("text", "align: left; width: 0.1;");

    this._interface.setAttribute("position", "0 0 -0.17;");

    this._interface.setAttribute("visible", "false"); // Add the interface to the camera.


    camera.appendChild(this._interface); // Add the camera to the scene.

    scene.appendChild(camera);
  }
  /**
   *  Private method for creating an overlay for the interface.
   *  @param    {Element}   parent    The parent element on which the overlay
   *                                  will be installed.
   */


  _createOverlay(parent) {
    // Create a container for the overlay element.
    this._overlayContainer = document.createElement("div");

    this._overlayContainer.classList.add("arscene-overlay"); // Create an overlay object.


    this._overlay = new Overlay(this._overlayContainer); // Add a title to the overlay.

    this._overlay.add("h2", {
      location: "top"
    }); // Add a description to the overlay.


    this._instructions = this._overlay.add("p", {
      location: "top"
    }); // Add a proceed button to the overlay.

    this._proceedButton = this._overlay.add("button"); // Add event listeners to this button with a debounced callback.

    const proceedHandler = debounce(() => void this.proceed(), 500);

    this._proceedButton.addEventListener('mousedown', proceedHandler);

    this._proceedButton.addEventListener('touchstart', proceedHandler); // Add an stop button to the overlay.


    this._stopButton = this._overlay.add("button", {
      text: "Exit"
    }); // Add event listeners to this button with a debounced callback. We want
    // this to just end the XR session. The event listener on the session will
    // then call the stop method.

    const stopHandler = debounce(() => void this._scene.xrSession.end(), 500);

    this._stopButton.addEventListener('mousedown', stopHandler);

    this._stopButton.addEventListener('touchstart', stopHandler); // Add the overlay container to the parent container.


    parent.appendChild(this._overlayContainer);
  }
  /**
   *  Private method to proceed to the mode for finding a location to place the
   *  object.
   */


  _placingMode() {
    // Change the mode.
    this._mode = "placing"; // We need the reticle to show.

    this._reticle.show(); // Make sure the 3D object is not visible.


    this._object.setAttribute('visible', 'false'); // Update the text on the proceed button.


    this._proceedButton.textContent = "Place"; // Update the text for the instructions.

    this._instructions.textContent = "Select a location to place the object.";
  }
  /**
   *  Private method to proceed to the mode for viewing the placed object.
   *  @TODO     Figure out what happens with the vectors and the quaternion.
   */


  _viewingMode() {
    // Change the mode.
    this._mode = "viewing"; // We need to hide the reticle.

    this._reticle.hide(); // We can copy the orientation of the reticle to place the object in the
    // scene.


    this._object.setAttribute("position", this._reticle.position());

    this._object.setAttribute("rotation", this._reticle.rotation()); // Make sure the object is visible.


    this._object.setAttribute('visible', 'true'); // Update the text on the proceed button.


    this._proceedButton.textContent = "Remove"; // Update the text for the instructions.

    this._instructions.textContent = "Take a moment to judge the size of that!";
  }
  /**
   *  Method for proceeding to the next step.
   *  @returns  {ArScene}
   */


  proceed() {
    // How we need to proceed depends on the mode we're currently in.
    switch (this._mode) {
      // If we're placing, we can view next.
      case "placing":
        this._viewingMode();

        break;
      // If we're viewing, we can go back to placing.

      case "viewing":
        this._placingMode();

        break;
    } // Allow chaining.


    return this;
  }
  /**
   *  Method to select a 3D object to show.
   *  @param    {integer}     category    Number indicating the object category.
   *  @returns  {ArScene}
   */


  select(category) {
    // // Define the categories we can represent.
    // const categories = {
    //   0: { size: 0.2, color: 'red' },
    //   1: { size: 0.5, color: 'yellow' },
    //   2: { size: 1.0, color: 'blue'}
    // }
    // // Get the appropriate properties for this category.
    // const properties = categories[category];
    // // Update the object.
    // this._object.setAttribute("width", properties.size);
    // this._object.setAttribute("height", properties.size);
    // this._object.setAttribute("depth", properties.size);
    // this._object.setAttribute("color", properties.color);
    // Immediately enter the augmented reality mode. This could fail, for
    // example if WebXR is not available or the user has not given permission.
    try {
      this._scene.enterAR();
    } catch (error) {
      this._handleError(error);
    } // Show the scene and allow chaining.


    return this.show();
  }
  /**
   *  Method for stopping the augmented reality session.
   *  @returns  {ArScene}
   */


  stop() {
    // Hide this object.
    this.hide(); // Also hide the reticle. This will make sure that it is no longer running
    // hit tests in the background.

    this._reticle.hide(); // Trigger the end event.


    this._eventHandler.trigger('end'); // Allow chaining.


    return this;
  }
  /**
   *  Method to show the scene.
   *  @returns  {ArScene}
   */


  show() {
    // Make sure we're not hiding the scene
    this._container.classList.remove("hidden"); // Allow chaining.


    return this;
  }
  /**
   *  Method to hide the scene.
   *  @returns  {ArScene}
   */


  hide() {
    // Make sure we're hiding the scene.
    this._container.classList.add("hidden"); // Allow chaining.


    return this;
  }
  /**
   *  Method for installing event handlers.
   *  @param    {...any}    args
   *  @returns  {ArScene}
   */


  on(...args) {
    // Pass everything to the event handler.
    this._eventHandler.on(...args); // Allow chaining.


    return this;
  }
  /**
   *  Method for removing event handlers.
   *  @param    {...any}    args
   *  @returns  {ArScene}
   */


  off(...args) {
    // Pass everything to the event handler.
    this._eventHandler.off(...args); // Allow chaining.


    return this;
  }
  /**
   *  Method to remove this object and clean up after itself.
   *  @returns  {ArScene}
   */


  remove() {
    // Stop the session.
    this.stop(); // Remove the other objects we've used.

    this._eventHandler.remove();

    this._overlay.remove();

    this._reticle.remove(); // Remove all DOM elements we've stored.


    this._container.remove();

    this._scene.remove();

    this._object.remove();

    this._overlayContainer.remove();

    this._interface.remove();

    this._proceedButton.remove();

    this._stopButton.remove();

    this._instructions.remove(); // Allow chaining.


    return this;
  }

} // Export the ArScene class so it can be imported elsewhere.


export { ArScene };