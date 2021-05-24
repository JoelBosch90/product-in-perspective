// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Overlay } from "/javascript/widgets/Overlay.js";
import { Reticle } from "/javascript/widgets/ArScene/Reticle.js";
import { debounce } from "/javascript/tools/debounce.js";
import { Request } from "/javascript/tools/Request.js";
import { AttributeObserver } from "/javascript/tools/AttributeObserver.js";
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

class ArScene extends BaseElement {
  /**
   *  This is the object that can make the HTTP requests needed in this class.
   *  @var      {Request}
   */
  _request = null;
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

  _model = null;
  /**
   *  Private variable that stores a reference to the container that houses all
   *  assets that are used for the 3D object.
   *  @var      {Element}
   */

  _assets = null;
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
   *  Private variable that stores a reference to the overlay proceed button.
   *  @var      {Element}
   */

  _proceedButton = null;
  /**
   *  Private variable that stores a reference to the overlay stop button.
   *  @var      {Element}
   */

  _stopButton = null;
  /**
   *  Private variable that stores a reference to the overlay instructions.
   *  @var      {Element}
   */

  _instructions = null;
  /**
   *  Private variable that stores a reference to the overlay title.
   *  @var      {Element}
   */

  _overlayTitle;
  /**
   *  Private variable that stores the texts for this scene.
   *  @var      {object}
   */

  _texts = null;
  /**
   *  Private variable that stores the attribute observer that we use to remove
   *  the 'a-fullscreen' class that Aframe likes to add to the HTML element.
   *  @var      {AttributeObserver}
   */

  _observer = null;
  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element on which the
   *                                  overlay interface will be installed.
   *  @param    {object}    texts     This is an object that provides texts for
   *                                  the augmented reality scene.
   *    @property {string}    "exit-button"         Text for the exit button.
   *    @property {string}    "placing-title"       Title text in placing mode.
   *    @property {string}    "placing-description" Description in placing mode.
   *    @property {string}    "placing-button"      Button text in placing mode.
   *    @property {string}    "viewing-title"       Title text in viewing mode.
   *    @property {string}    "viewing-description" Description in viewing mode.
   *    @property {string}    "viewing-button"      Button text in viewing mode.
   */

  constructor(parent, texts) {
    // Call the base class constructor.
    super(); // Store the texts we need to use.

    this._texts = texts; // We need to be able to make HTTP requests later to load the models.

    this._request = new Request(); // Initialize the interface.

    this._initInterface(parent);
  }
  /**
   *  Private method for initializing the DOM interface.
   *  @param    {Element}   parent    The parent element on which the overlay
   *                                  and the scene will be installed.
   */


  _initInterface = parent => {
    // Create a container for the barcode scanner.
    this._container = document.createElement("div");

    this._container.classList.add("arscene"); // Create the overlay in this container.


    this._createOverlay(this._container); // Create the scene in this container.


    this._createScene(this._container); // Make sure that all interface elements are initially hidden.


    this.hide(); // Add the entire interface to the parent container.

    parent.appendChild(this._container);
  };
  /**
   *  Private method for creating an Aframe scene for augmented reality.
   *  @param    {Element}   parent    The parent element on which the scene will
   *                                  be installed.
   */

  _createScene = parent => {
    // Create the Aframe scene element.
    this._scene = document.createElement("a-scene");

    this._scene.classList.add("arscene-scene");

    this._scene.setAttribute("visible", "false"); // Disable the custom UI that Aframe adds onto the scene. We should provide
    // our own button for entering AR.


    this._scene.setAttribute("vr-mode-ui", "enabled: false"); // Make sure we can have access to the hit test feature, attach the overlay,
    // and initialize the AR session at the user's feet.


    this._scene.setAttribute("webxr", "optionalFeatures: hit-test, local-floor, dom-overlay; overlayElement: .arscene-overlay;"); // Add a reticle to the scene.


    this._reticle = new Reticle(this._scene); // Add the overlay to the scene.

    this._addOverlayToScene(this._scene); // Add the scene to the parent container.


    parent.prepend(this._scene); // Aframe may attempt to add 'a-fullscreen to the HTML element on the page.
    // This class helps create a fullscreen orientation, but it sacrifices
    // scrolling. Because we're in a single page application, this might mess up
    // different parts of the application, so we want to remove this class so
    // that we can offload this responsibility elsewhere (like the
    // Representation class).

    this._preventClass("html", "a-fullscreen"); // Check to see if the renderer has already started. If so, we can
    // immediately initialize the scene.


    if (this._scene.renderStarted) this._initScene(); // Otherwise, we need to wait for the scene element to load first.
    else this._scene.addEventListener("loaded", () => void this._initScene());
  };
  /**
   *  Private method to watch a single DOM element and remove a certain class
   *  from that element as soon as it appears. It will only prevent this
   *  behaviour once.
   *  @param  {string}    tagName     Name of the DOM element tag.
   *  @param  {string}    className   Name of the class that should be
   *                                  prevented.
   */

  _preventClass = (tagName, className) => {
    // Get the first occurrence of this tag.
    const tag = document.getElementsByTagName(tagName)[0]; // Create a new attribute observer to observe changes in the DOM.

    this._observer = new AttributeObserver(); // Start observing our element.

    this._observer.on(tag, mutation => {
      // No need to observe anything but class changes.
      if (mutation.attributeName != "class") return; // If the HTML element does not yet have the specific class, we should
      // keep waiting.

      if (!tag.classList.contains(className)) return; // Remove the class.

      tag.classList.remove(className); // After we've removed the class we can stop observing the HTML element
      // and we no longer need the attribute observer.

      this._observer.remove();
    });
  };
  /**
   *  Private method for initializing the scene by adding event listeners and
   *  triggering the loaded event.
   */

  _initScene = () => {
    // Add an event listener to the scene to detect when the user has exited the
    // scene.
    this._scene.addEventListener("exit-vr", () => void this.stop()); // Add an event listener to the scene to detect when the user has entered
    // the scene.


    this._scene.addEventListener("enter-vr", () => void this._activateScene()); // Announce that the scene has finished loading.


    this.trigger("loaded");
  };
  /**
   *  Method to activate the augmented reality scene.
   */

  _activateScene = () => {
    // Did we end up in virtual reality mode?
    if (this._scene.is("vr-mode")) return this._handleError("VR mode is not yet implemented."); // Did we fail to get to augmented reality mode?

    if (!this._scene.is("ar-mode")) return this._handleError("Could not enter augmented reality mode."); // Do we have a DOM overlay?

    const domOverlay = !!(this._scene.xrSession.domOverlayState && this._scene.xrSession.domOverlayState.type); // Mount the overlay in the augmented reality session.

    this._overlayContainer.setAttribute('text', 'value', 'Overlay: ' + domOverlay); // Make sure the overlay is visible.


    this._overlayContainer.setAttribute('visible', 'true'); // Make sure the augmented reality scene is visible.


    this._scene.setAttribute('visible', 'true'); // Go to placing mode.


    this._placingMode();
  };
  /**
   *  Private method for handling errors.
   *  @param    {string}    message A message explaining what went wrong.
   */

  _handleError = message => {
    // Trigger the error event.
    this.trigger("error", message);
  };
  /**
   *  Private method for adding a interface in an Aframe scene. This interface
   *  is an object in augmented reality that is attached to the camera view that
   *  we can attach the overlay to.
   *  @param    {Element}   scene   The Aframe scene to which the interface is
   *                                added.
   */

  _addOverlayToScene = scene => {
    // Create an Aframe camera element. To add the overlay to the scene, we can
    // create an interface in a camera object that we can mount the overlay to.
    const camera = document.createElement("a-camera"); // Create an Aframe entity element for the interface.

    this._interface = document.createElement("a-entity");

    this._interface.classList.add("arscene-interface");

    this._interface.setAttribute("text", "align: left; width: 0.1;");

    this._interface.setAttribute("position", "0 0 -0.25;");

    this._interface.setAttribute("visible", "false"); // Add the interface to the camera.


    camera.appendChild(this._interface); // Add the camera to the scene.

    scene.appendChild(camera);
  };
  /**
   *  Private method for creating an overlay for the interface.
   *  @param    {Element}   parent    The parent element on which the overlay
   *                                  will be installed.
   */

  _createOverlay = parent => {
    // Create a container for the overlay element.
    this._overlayContainer = document.createElement("div");

    this._overlayContainer.classList.add("arscene-overlay"); // Create an overlay object.


    this._overlay = new Overlay(this._overlayContainer); // Add a title to the overlay.

    this._overlayTitle = this._overlay.add("h1", {
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
      text: this._texts["exit-button"]
    }); // Add event listeners to this button with a debounced callback. We want
    // this to just end the XR session. The event listener on the session will
    // then call the stop method.

    const stopHandler = debounce(() => void this._scene.xrSession.end(), 500);

    this._stopButton.addEventListener('mousedown', stopHandler);

    this._stopButton.addEventListener('touchstart', stopHandler); // Add the overlay container to the parent container.


    parent.appendChild(this._overlayContainer);
  };
  /**
   *  Private method to proceed to the mode for finding a location to place the
   *  object.
   */

  _placingMode = () => {
    // Change the mode.
    this._mode = "placing"; // We need the reticle to show.

    this._reticle.show(); // Make sure the 3D object is not visible.


    this._model.setAttribute('visible', 'false'); // Update the text of the overlay title.


    if (this._texts["placing-title"]) this._overlayTitle.textContent = this._texts["placing-title"]; // Update the text on the proceed button.

    if (this._texts["placing-button"]) this._proceedButton.textContent = this._texts["placing-button"]; // Update the text for the instructions.

    if (this._texts["placing-description"]) this._instructions.textContent = this._texts["placing-description"];
  };
  /**
   *  Private method to proceed to the mode for viewing the placed object.
   *  @TODO     Figure out what happens with the vectors and the quaternion.
   */

  _viewingMode = () => {
    // Change the mode.
    this._mode = "viewing"; // We need to hide the reticle.

    this._reticle.hide(); // We can copy the orientation of the reticle to place the object in the
    // scene.


    this._model.setAttribute("position", this._reticle.position());

    this._model.setAttribute("rotation", this._reticle.rotation()); // Make sure the object is visible.


    this._model.setAttribute('visible', 'true'); // Update the text of the overlay title.


    if (this._texts["viewing-title"]) this._overlayTitle.textContent = this._texts["viewing-title"]; // Update the text on the proceed button.

    if (this._texts["viewing-button"]) this._proceedButton.textContent = this._texts["viewing-button"]; // Update the text for the instructions.

    if (this._texts["viewing-description"]) this._instructions.textContent = this._texts["viewing-description"];
  };
  /**
   *  Method that returns whether the augmented reality scene has loaded yet.
   *  @returns  {boolean}
   */

  active = () => this._scene.renderStarted;
  /**
   *  Method for proceeding to the next step.
   *  @returns  {ArScene}
   */

  proceed = () => {
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
  };
  /**
   *  Method to select a 3D object to show.
   *  @param    {Object}    product     Object container the properties of the
   *                                    selected product.
   *  @returns  {ArScene}
   */

  select = product => {
    // Immediately enter the augmented reality mode. This could fail, for
    // example if WebXR is not available or the user has not given
    // permission.
    try {
      // Construct the URL that we can use to load the 3D model.
      const modelUrl = this._request.model(product.model); // Add the 3D model to the scene.


      this._insertModel(modelUrl); // Enter augmented reality.


      this._scene.enterAR(); // Then show the scene.


      this.show();
    } catch (error) {
      this._handleError(error);
    } // Allow chaining.


    return this;
  };
  /**
   *  Private method for adding an object in an Aframe scene.
   *  @param    {string}    source    This is path to the model that we can
   *                                  load into the asset.
   */

  _insertModel = source => {
    // Create an Aframe GLTF element.
    this._model = document.createElement("a-gltf-model");

    this._model.classList.add("arscene-object"); // Load the source directly onto the model.


    this._model.setAttribute("src", source); // For now, set some small dimensions manually.
    // @TODO determine size dynamically.
    // this._model.setAttribute("scale", "0.1 0.1 0.1");
    // It should be hidden until it is placed in the scene by the user.


    this._model.setAttribute("visible", "false"); // Add the object to the scene.


    this._scene.appendChild(this._model);
  };
  /**
   *  Method for stopping the augmented reality session.
   *  @returns  {ArScene}
   */

  stop = () => {
    // Hide the reticle. This will make sure that it is no longer running hit
    // tests in the background.
    this._reticle.hide(); // Trigger the end event.


    this.trigger('end'); // Allow chaining.

    return this;
  };
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */

  remove() {
    // Stop the session.
    this.stop(); // Remove the other objects we've used.

    if (this._overlay) this._overlay.remove();
    if (this._reticle) this._reticle.remove();
    if (this._observer) this._observer.remove();
    if (this._request) this._request.remove(); // Remove all DOM elements we've stored.

    if (this._scene) this._scene.remove();
    if (this._model) this._model.remove();
    if (this._assets) this._assets.remove();
    if (this._overlayContainer) this._overlayContainer.remove();
    if (this._interface) this._interface.remove();
    if (this._proceedButton) this._proceedButton.remove();
    if (this._stopButton) this._stopButton.remove();
    if (this._instructions) this._instructions.remove(); // Call the original remove method.

    super.remove();
  }

} // Export the ArScene class so it can be imported elsewhere.


export { ArScene };