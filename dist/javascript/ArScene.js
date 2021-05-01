// Import dependencies.
import { EventHandler } from "/javascript/EventHandler.js";
import { Overlay } from "/javascript/Overlay.js";
import { debounce } from "/javascript/debounce.js";

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
   *  @var      {Element}
   */
  _reticle = null;

  /**
   *  Private variable that stores a reference to the Aframe 3D object.
   *  @var      {Element}
   */
  _object = null;

  /**
   *  Private variable that stores a reference to the container that houses the
   *  overlay.
   *  @var      {Element}
   */
  _overlay = null;

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
    this._eventHandler = new EventHandler();

    // Initialize the interface.
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
    this._container.classList.add("arscene");

    // Create the overlay in this container.
    this._initOverlay(this._container);

    // Create the scene in this container.
    this._initScene(this._container);

    // Make sure that all interface elements are initially hidden.
    this.hide();

    // Add the entire interface to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Private method for creating an Aframe scene for augmented reality.
   *  @param    {Element}   parent    The parent element on which the scene will
   *                                  be installed.
   */
  _initScene(parent) {

    // Create the Aframe scene element.
    this._scene = document.createElement("a-scene");
    this._scene.classList.add("arscene-scene");
    this._scene.setAttribute("visible", "false");
    this._scene.setAttribute("vr-mode-ui", "enabled: false");
    this._scene.setAttribute("webxr", "optionalFeatures: hit-test, local-floor, dom-overlay; overlayElement: .arscene-overlay;");

    // Add a reticle to the scene.
    this._insertReticle(this._scene);

    // Add a 3D object to the scene.
    this._insertObject(this._scene);

    // Add the overlay to the scene.
    this._insertOverlay(this._scene);

    // Add an event listener to the scene to detect when the user has exited the
    // scene.
    this._scene.addEventListener("exit-vr", () => void this.stop());

    // Add an event listener to the scene to detect when the user has entered
    // the scene.
    this._scene.addEventListener("enter-vr", () => void this._activateScene());

    // Add the scene to the parent container.
    parent.prepend(this._scene);
  }

  /**
   *  Method to activate the augmented reality scene.
   */
  _activateScene() {

    // Did we end up in virtual reality mode?
    if (this._scene.is("vr-mode")) return this._handleError("VR mode is not yet implemented.");

    // Did we fail to get to augmented reality mode?
    if (!this._scene.is("ar-mode")) return this._handleError("Could not enter augmented reality mode.");

    // Do we have a DOM overlay?
    const domOverlay = !!(this._scene.xrSession.domOverlayState && this._scene.xrSession.domOverlayState.type);

    // Mount the overlay in the augmented reality session.
    this._overlay.setAttribute('text', 'value', 'Overlay: ' + domOverlay);

    // Make sure the overlay is visible.
    this._overlay.setAttribute('visible', 'true');

    // Make sure the augmented reality scene is visible.
    this._scene.setAttribute('visible', 'true');

    // Go to placing mode.
    this._placingMode();
  }

  /**
   *  Private method for handling errors.
   *  @param    {string}    message A message explaining what went wrong.
   */
  _handleError(message) {

    // Log the error to the console.
    console.error(message);

    // Stop the session.
    this.stop();
  }

  /**
   *  Private method for adding a reticle in an Aframe scene.
   *  @param    {Element}   scene   The Aframe scene to which the reticle is
   *                                added.
   *
   *  @TODO     Use a better reticle.
   */
  _insertReticle(scene) {

    // Create an Aframe entity element.
    this._reticle = document.createElement("a-entity");
    this._reticle.classList.add("arscene-reticle");
    this._reticle.setAttribute("ar-hit-test", "doHitTest:false");
    this._reticle.setAttribute("visible", "false");

    // Create an Aframe plane element.
    const plane = document.createElement("a-plane");
    plane.setAttribute("rotation", "-90 0 0");
    plane.setAttribute("width", "0.2");
    plane.setAttribute("height", "0.2");
    plane.setAttribute("src", "/images/arrowTransparent.png");
    plane.setAttribute("material", "transparent:true;");

    // Add the plane to the reticle.
    this._reticle.appendChild(plane);

    // Add the reticle to the scene.
    scene.appendChild(this._reticle);
  }

  /**
   *  Private method for adding an object in an Aframe scene.
   *  @param    {Element}   scene   The Aframe scene to which the object is
   *                                added.
   *
   *  @TODO     Load relevant 3D objects that represent the appropriate amount
   *            of plastic waste.
   */
  _insertObject(scene) {

    // Create the model asset.
    const model = document.createElement("a-asset-item");
    model.setAttribute("src", "/models/yougurt_pack_01-obj.obj");
    model.id = "arscene-model";

    // Create the material asset.
    const material = document.createElement("a-asset-item");
    material.setAttribute("src", "/models/yougurt_pack_01-obj.mtl");
    material.id = "arscene-material";

    // Add it to the list of assets.
    const assets = document.createElement("a-assets");
    assets.appendChild(model);
    assets.appendChild(material);

    // Create an Aframe box element.
    this._object = document.createElement("a-obj-model");
    this._reticle.classList.add("arscene-object");
    this._object.setAttribute("src", "#arscene-model");
    this._object.setAttribute("mtl", "#arscene-material");
    this._object.setAttribute("visible", "false");
    this._object.setAttribute("position", "0 0 0");
    this._object.setAttribute("rotation", "0 0 0");
    // this._object.setAttribute("width", "0.5");
    // this._object.setAttribute("height", "0.5");
    // this._object.setAttribute("depth", "0.5");
    // this._object.setAttribute("color", "pink");
    // this._object.setAttribute("static-body");

    // Add the assets and the object to the scene.
    scene.appendChild(assets);
    scene.appendChild(this._object);
  }

  /**
   *  Private method for adding a interface in an Aframe scene. This interface
   *  is an object in augmented reality that is attached to the camera view that
   *  we can attach the overlay to.
   *  @param    {Element}   scene   The Aframe scene to which the interface is
   *                                added.
   */
  _insertOverlay(scene) {

    // Create an Aframe camera element. To add the overlay to the scene, we can
    // create an interface in a camera object that we can mount the overlay to.
    const camera = document.createElement("a-camera");

    // Create an Aframe entity element for the interface.
    this._interface = document.createElement("a-entity");
    this._interface.classList.add("arscene-interface");
    this._interface.setAttribute("text", "align: left; width: 0.1;");
    this._interface.setAttribute("position", "0 0 -0.17;");
    this._interface.setAttribute("visible", "false");

    // Add the interface to the camera.
    camera.appendChild(this._interface);

    // Add the camera to the scene.
    scene.appendChild(camera);
  }

  /**
   *  Private method for creating an overlay for the interface.
   *  @param    {Element}   parent    The parent element on which the overlay
   *                                  will be installed.
   */
  _initOverlay(parent) {

    // Create a container for the overlay element.
    this._overlay = document.createElement("div");
    this._overlay.classList.add("arscene-overlay");

    // Create an overlay object.
    const overlay = new Overlay(this._overlay);

    // Add a title to the overlay.
    overlay.add("h2", { location: "top" });

    // Add a description to the overlay.
    this._instructions = overlay.add("p", { location: "top" });

    // Add a proceed button to the overlay.
    this._proceedButton = overlay.add("button");

    // Add event listeners to this button with a debounced callback.
    const proceedHandler = debounce(() => void this.proceed(), 500);
    this._proceedButton.addEventListener('mousedown', proceedHandler);
    this._proceedButton.addEventListener('touchstart', proceedHandler);

    // Add an stop button to the overlay.
    this._stopButton = overlay.add("button", { text: "Exit" });

    // Add event listeners to this button with a debounced callback. We want
    // this to just end the XR session. The event listener on the session will
    // then call the stop method.
    const stopHandler = debounce(() => void this._scene.xrSession.end(), 500);
    this._stopButton.addEventListener('mousedown', stopHandler);
    this._stopButton.addEventListener('touchstart', stopHandler);

    // Add the overlay container to the parent container.
    parent.appendChild(this._overlay);
  }

  /**
   *  Method for proceeding to the next step.
   *  @returns  {ArScene}
   */
  proceed() {

    // How we need to proceed depends on the mode we're currently in.
    switch (this._mode)
    {
      // If we're placing, we can view next.
      case "placing": this._viewingMode(); break;

      // If we're viewing, we can go back to placing.
      case "viewing": this._placingMode(); break;
    }

    // Allow chaining.
    return this;
  }

  /**
   *  Private method to proceed to the mode for finding a location to place the
   *  object.
   */
  _placingMode() {

    // Change the mode.
    this._mode = "placing";

    // We need the hit test on the reticlee.
    this._reticle.setAttribute('ar-hit-test', 'doHitTest:true');

    // Make sure the reticle is visible.
    this._reticle.setAttribute('visible', 'true');

    // Make sure the 3D object is not visible.
    this._object.setAttribute('visible', 'false');

    // Update the text on the proceed button.
    this._proceedButton.textContent = "Place";

    // Update the text for the instructions.
    this._instructions.textContent = "Select a location to place the object.";
  }

  /**
   *  Private method to proceed to the mode for viewing the placed object.
   *  @TODO     Figure out what happens with the vectors and the quaternion.
   */
  _viewingMode() {

    // Change the mode.
    this._mode = "viewing";

    // Make sure the reticle is not visible.
    this._reticle.setAttribute('visible', 'false');

    // We don't need the hit test on the reticle for the viewing mode.
    this._reticle.setAttribute('ar-hit-test', 'doHitTest:false');

    // We can copy the position of the reticle to place the object in the scene.
    this._object.setAttribute("position", this._reticle.getAttribute("position"));

    const upVector = new THREE.Vector3(0, 1, 0);
    const tempVector = new THREE.Vector3();
    const tempQuaternion = new THREE.Quaternion();
    tempVector.set(0, 0 ,-1);
    tempVector.applyQuaternion(this._reticle.object3D.quaternion);
    tempQuaternion.setFromUnitVectors(tempVector, upVector);
    this._object.object3D.quaternion.multiplyQuaternions(tempQuaternion, this._reticle.object3D.quaternion);

    // Make sure the object is visible.
    this._object.setAttribute('visible', 'true');

    // Update the text on the proceed button.
    this._proceedButton.textContent = "Remove";

    // Update the text for the instructions.
    this._instructions.textContent = "Take a moment to judge the size of that!";
  }

  /**
   *  Method to select a 3D object to show.
   *  @param    {integer}     category    Number indicating the object category.
   *  @returns  {ArScene}
   */
  select(category) {

    // Define the categories we can represent.
    const categories = {
      0: { size: 0.2, color: 'red' },
      1: { size: 0.5, color: 'yellow' },
      2: { size: 1.0, color: 'blue'}
    }

    // Get the appropriate properties for this category.
    const properties = categories[category];

    // Update the object.
    this._object.setAttribute("width", properties.size);
    this._object.setAttribute("height", properties.size);
    this._object.setAttribute("depth", properties.size);
    this._object.setAttribute("color", properties.color);

    // Immediately enter the augmented reality mode.
    this._scene.enterAR();

    // Now we can show our scene.
    this.show();

    // Allow chaining.
    return this;
  }

  /**
   *  Method for stopping the augmented reality session.
   *  @returns  {ArScene}
   */
  stop() {

    // Hide this object.
    this.hide();

    // Trigger the end event.
    this._eventHandler.trigger('end');

    // Allow chaining.
    return this;
  }

  /**
   *  Method to show the scene.
   *  @returns  {ArScene}
   */
  show() {

    // Make sure we're not hiding the scene
    this._container.hidden = false;

    // Allow chaining.
    return this;
  }

  /**
   *  Method to hide the scene.
   *  @returns  {ArScene}
   */
  hide() {

    // Make sure we're hiding the scene.
    this._container.hidden = true;

    // Allow chaining.
    return this;
  }

  /**
   *  Method for installing event handlers.
   *  @param    {...any}    args
   *  @returns  {ArScene}
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
   *  @returns  {ArScene}
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