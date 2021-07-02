// Import dependencies.
import { BaseElement } from "../BaseElement.js";
import { Request } from "../../tools/Request.js";
/**
 *  The definition of the ArModel class that can be used as a base for any
 *  class that is based on a DOM element.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class ArModel extends BaseElement {
  /**
   *  This is the object that can make the HTTP requests needed in this class.
   *  @var      {Request}
   */
  _request = null;
  /**
   *  Private variable that stores a reference to the container element in the
   *  DOM.
   *  @var      {Element}
   */

  _container = null;
  /**
   *  Keep an array of all models and their positions.
   *  @var      {Array}
   */

  _models = [];
  /**
   *  Reference to the current position of the model.
   *  @var      {Vector3}
   */

  _position = null;
  /**
   *  Reference to the current rotation of the model.
   *  @var      {Object}
   */

  _rotation = null;
  /**
   *  Keep the model's dimension in cache.
   *  @var      {Object}
   */

  _dimensions = null;
  /**
   *  Class constructor.
   *  @param    {Element}     parent    The parent container to which the
   *                                    ArModel will be added.
   *  @param    {...any}      options   Optional initial options that will be
   *                                    passed to the update method.
   */

  constructor(parent, ...options) {
    // First call the BaseElement constructor.
    super(); // Create a container for the model.

    this._container = document.createElement('a-entity');

    this._container.classList.add('ar-model'); // We need to be able to make HTTP requests later to load the models.


    this._request = new Request(); // Call the update method with any initial settings.

    if (options.length) this.update(...options); // Add the container to the parent element.

    parent.appendChild(this._container);
  }
  /**
   *  Method to update the parameters of this model.
   *  @param    {string}    model       The object ID.
   *  @param    {Number}    number      The number of objects we should spawn.
   *  @param    {Number}    scale       The scale at which the model should be
   *                                    shown.
   *  @returns  {Promise}
   */


  update = async (model, number = 1, scale = 1) => {
    // Hide the model while updating.
    this.hide(); // Update the source and the distance.

    const source = this._request.model(model); // Remove all current models.


    this.clear(); // Keep track of all promises for loading the models.

    const promises = []; // Start adding models.

    for (let i = 0; i < number; i++) promises.push(this._addModel(source, scale)); // Return the promise that all models have loaded.


    return Promise.all(promises) // Wait for all models to load.
    .then(() => {
      // Get the dimensions for the new model.
      this._dimensions = this._modelDimensions(); // Position the model properly and show it.

      this.position().show();
    });
  };
  /**
   *  Method to move the model to a new position.
   *  @param    {Vector3}   vector    The vector that describes the new location
   *                                  to move to.
   *  @param    {Object}    vector    The vector that describes the way the
   *                                  model should be rotated.
   *  @returns  {ArModel}
   */

  position = (position, rotation) => {
    // Make sure our cache and current position are up to date.
    if (position) this._position = position;else position = this._position; // Make sure our cache and current rotation are up to date.

    if (rotation) this._rotation = rotation;else rotation = this._rotation; // We need both a position and a rotation to continue.

    if (!position || !rotation) return this; // Get the current number of models.

    const number = this._models.length; // Get the number of models in a single row.

    const row = Math.ceil(Math.pow(number, 1 / 3)); // Get the number of models on a single floor.

    const floor = row ** 2; // Get an object describing the model's dimensions.

    const dimensions = this._dimensions; // Create the position vector for the first model in the corner. We can
    // clone the providing position object so that we're sure that we're working
    // with the same type of vector.

    const start = position.clone() // First, we subtract the offset so that the model expands to the right
    // from the starting position. Then, we subtract half the width of the
    // models in a single row to center the model around the x axis.
    .setX(position.x - dimensions.xOffset - row * dimensions.width / 2) // We always want to start on the surface and grow upwards.
    .setY(position.y - dimensions.yOffset) // First, we subtract the offset so that the model expands to the front
    // from the starting position. Then, we subtract half the depth of the
    // models in a single row to center the model around the z axis.
    .setZ(position.z - dimensions.zOffset - row * dimensions.depth / 2); // We need one vector that we're constantly updating to reposition each
    // model. We can start by simply cloning the start vector.

    const update = start.clone(); // Loop through all models.

    for (let i = 0; i < this._models.length; i++) {
      // We want to change the x coordinate every iteration and reset every row,
      // or whenever the index is divisible by the length of the row.
      const xLevel = i % row; // We want to change the y coordinate every floor and we don't need to
      // reset.

      const yLevel = ~~(i / floor); // We want to change the z coordinate every row and we need to reset every
      // floor.

      const zLevel = ~~(i / row) % row; // Apply the changes to the update vector.

      update.setX(start.x + xLevel * dimensions.width).setY(start.y + yLevel * dimensions.height).setZ(start.z + zLevel * dimensions.depth); // Get the model.

      const model = this._models[i]; // Update the model's position.

      model.setAttribute("position", update); // Update the model's rotation.

      model.setAttribute("rotation", rotation);
    } // Allow chaining.


    return this;
  };
  /**
   *  Method to get an object describing certain model specific parameters.
   *  @returns    {Object}
   *    @property {Number}      width     Size of the model along the x axis.
   *    @property {Number}      height    Size of the model along the y axis.
   *    @property {Number}      depth     Size of the model along the z axis.
   *    @property {Number}      yOffset   Distance between the model and the
   *                                      floor.
   */

  _modelDimensions = () => {
    // We can use any model for this, as they all have the same source.
    const model = this._models[0]; // Did we get a model?

    if (model) {
      // Get the 3D box from the model.
      const box = new AFRAME.THREE.Box3();
      box.setFromObject(model.object3D); // Return dimensions based on the box model.

      return {
        // Return the dimensions of the model.
        width: box.max.x - box.min.x,
        height: box.max.y - box.min.y,
        depth: box.max.z - box.min.z,
        // Include how far the left side of the model is off to the left.
        xOffset: box.min.x,
        // Include how far the model is floating off the floor.
        yOffset: box.min.y,
        // Include how close the front of the model is to the front.
        zOffset: box.min.z
      };
    } // Otherwise, return some arbitrary defaults.


    return {
      // Assume the model is a cubic meter in size.
      width: 1,
      height: 1,
      depth: 1,
      // Assume the model is exactly where it says it is.
      xOffset: 0,
      yOffset: 0,
      zOffset: 0
    };
  };
  /**
   *  Method to add a new model.
   *  @param    {string}      source      URL to load the model.
   *  @param    {string}      scale       Scale at which to display the model.
   *  @returns  {Promise}
   */

  _addModel = async (source, scale) => {
    // Return a promise.
    return new Promise((resolve, reject) => {
      // Create a new GLTF model element to use in the DOM.
      const model = document.createElement("a-gltf-model"); // Add the object class to the new element.

      model.classList.add("arscene-object"); // Make sure we can see the model.

      model.setAttribute("visible", "true"); // Set the model scaling.

      model.object3D.scale.set(scale, scale, scale); // Add the model element to the container.

      this._container.appendChild(model); // Add the model object to our models array.


      this._models.push(model); // Resolve the promise as soon as the model has loaded.


      model.addEventListener('model-loaded', resolve); // Start loading the model.

      model.setAttribute("src", source);
    });
  };
  /**
   *  Method to remove a single model.
   */

  _removeModel = () => {
    // Get the last model from the array.
    const model = this._models.pop(); // Remove the model.


    model.remove();
  };
  /**
   *  Method to remove to remove all models.
   *  @returns  {ArModel}
   */

  clear = () => {
    // Keep removing models until there are none left.
    while (this._models.length) this._removeModel(); // Allow chaining.


    return this;
  };
  /**
   *  Method to show this element.
   *  @returns  {ArModel}
   */

  show() {
    // Make sure we're not hiding.
    super.show(); // We also need to seperately hide all of our models.

    for (const model of this._models) model.setAttribute('visible', 'true'); // Allow chaining.


    return this;
  }
  /**
   *  Method to hide this element.
   *  @returns  {ArModel}
   */


  hide() {
    // Make sure we're hiding.
    super.hide(); // We also need to seperately hide all of our models.

    for (const model of this._models) model.setAttribute('visible', 'false'); // Allow chaining.


    return this;
  }
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */


  remove() {
    // Remove any classes we've constructed.
    if (this._request) this._request.remove(); // Remove all models.

    for (const model of this._models) model.remove(); // Reset the array.


    this._models = []; // Call the BaseHandler's remove function.

    super.remove();
  }

} // Export the ArModel class so it can be imported elsewhere.


export { ArModel };