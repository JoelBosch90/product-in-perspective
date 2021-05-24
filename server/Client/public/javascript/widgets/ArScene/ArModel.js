// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Request } from "/javascript/tools/Request.js";
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
   *  Remember the model source.
   *  @var      {string}
   */

  _source = null;
  /**
   *  Remember the minimum distances between models.
   *  @var      {Object}
   */

  _distance = {};
  /**
   *  Class constructor.
   *  @param    {Element}     parent    The parent container to which the
   *                                    ArModel will be added.
   *  @param    {...any}      options   Optional iniital options that will be
   *                                    passed to the update method.
   */

  constructor(parent, ...options) {
    // First call the BaseElement constructor.
    super(); // Create a container for the model.

    this._container = document.createElement('a-entity');

    this._container.classList.add('ar-model'); // We need to be able to make HTTP requests later to load the models.


    this._request = new Request(); // Call the update method with any initial settings.

    if (options) this.update(...options); // Add the container to the parent element.

    parent.appendChild(this._container);
  }
  /**
   *  Method to update the parameters of this model.
   *  @param    {string}    model       The object ID.
   *  @param    {Number}    number      The number of objects we should spawn.
   *  @param    {Object}    distance    The distances between objects.
   *    @property {Number}    x           Horizontal distance.
   *    @property {Number}    y           Vertical distance.
   *    @property {Number}    z           Depth distance.
   *  @returns  {ArModel}
   */


  update = (model, number, distance) => {
    // Update the source and the distance.
    this._source = this._request.model(model);
    this._distance = distance; // Get the difference between the current number of models and the requested
    // number.

    const difference = Math.abs(number - this._models.length); // If we have too few models, add more.

    if (number > this._models.length) for (let i = 0; i < difference; i++) this._addModel(); // If we have too many models, remove some.
    else for (let i = 0; i < difference; i++) this._removeModel(); // Allow chaining.

    return this;
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
    // Get the current number of models.
    const number = this._models.length; // Get the number of models in a single row.

    const row = Math.ceil(Math.pow(number, 1 / 3)); // Get the number of models on a single floor.

    const floor = row ** 2; // Get the index of the middle of a row. We should center around the middle
    // position.

    const middle = Math.floor(row / 2); // Create the position vector for the first model in the corner. We can
    // clone the providing position object so that we're sure that we're working
    // with the same type of vector.

    const start = position.clone() // We want to move left by half the maximum distance so that we'll end up
    // centering around the requested position along the X axis.
    .setX(position.x - middle * this._distance.x) // We always want to start on the surface and grow upwards.
    .setY(position.y) // Let's keep Z static for now.
    .setZ(position.z - middle * this._distance.z); // We need one vector that we're constantly updating to reposition each
    // model. We can start by simply cloning the start vector.

    const update = start.clone();
    console.log("Start", row, floor); // Loop through all models.

    for (let i = 0; i < this._models.length; i++) {
      // We want to change the x coordinate every iteration and reset every row,
      // or whenever the index is divisible by the length of the row.
      const xLevel = i % row; // We want to change the y coordinate every floor and we don't need to
      // reset.

      const yLevel = ~~(i / floor); // We want to change the z coordinate every row and we need to reset every
      // floor.

      const zLevel = ~~(i / row) % row;
      console.log("Update", xLevel, yLevel, zLevel); // Apply the changes to the update vector.

      update.setX(start.x + xLevel * this._distance.x).setY(start.y + yLevel * this._distance.y).setZ(start.z + zLevel * this._distance.z); // Get the model.

      const model = this._models[i]; // Update the model's position.

      model.setAttribute("position", update); // Update the model's rotation.

      model.setAttribute("rotation", rotation);
    } // Allow chaining.


    return this;
  };
  /**
   *  Method to add a new model.
   */

  _addModel = () => {
    console.log("::_addModel"); // Create a new GLTF model element to use in the DOM.

    const model = document.createElement("a-gltf-model"); // Add the object class to the new element.

    model.classList.add("arscene-object"); // Load the source directly onto the model.

    model.setAttribute("src", this._source); // It should be hidden by default.
    // model.setAttribute("visible", "false");

    model.setAttribute("visible", "true"); // Add the model element to the container.

    this._container.appendChild(model); // Add the model object to our models array.


    this._models.push(model);
  };
  /**
   *  Method to remove a model.
   */

  _removeModel = () => {
    console.log("::_removeModel"); // Get the last model from the array.

    const model = this._models.pop(); // Remove the model.


    model.remove();
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