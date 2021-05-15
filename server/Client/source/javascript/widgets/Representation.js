// Import dependencies
import { BaseElement } from "/javascript/widgets/BaseElement.js";

// Import project dependencies.
import { BarcodeScanner } from "/javascript/widgets/BarcodeScanner.js";
import { ArScene } from "/javascript/widgets/ArScene.js";
import { ScriptLoader } from "/javascript/tools/ScriptLoader.js";
import { Request } from "/javascript/tools/Request.js";
import { debounce } from "/javascript/tools/debounce.js";

/**
 *  The definition of the Representation class that can be used as to
 *  scan a product by its barcode and then show a 3D representation of that
 *  product in an augmented reality scene.
 *
 *  @event      error         Triggered when an unrecoverable error has
 *                            occurred.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Representation extends BaseElement {

  /**
   *  This is the object that can make the HTTP requests needed in this class.
   *  @var      {Request}
   */
  _request = null;

  /**
   *  We want to keep a reference to the current instance of the augmented
   *  reality scene.
   *  @var      {ArScene}
   */
  _scene = null;

  /**
   *  We want to keep a reference to the current instance of the barcode
   *  scanner.
   *  @var      {BarcodeScanner}
   */
  _scanner = null;

  /**
   *  For some parts of this product we need certain libraries to be loaded, so
   *  we want to keep track of the script loader.
   *  @var      {ScriptLoader}
   */
  _scriptLoader = null;

  /**
   *  We want to keep track of all products that we want to be able to scan.
   *  Here we map the product barcodes to an object with their information.
   *  @var      {object}
   */
  _products = {};

  /**
   *  This is the promise for requesting the products for this app.
   *  @var      {Promise}
   */
  _productsPromise = null;

  /**
   *  We want to keep track of the scanned product that we are currently showing
   *  to the user.
   *  @var      {object}
   */
  _shownProduct = null;

  /**
   *  We want to keep track of an HTML element where we can show the current
   *  @var      {Element}
   */
  _productDisplay = null;

  /**
   *  We want to keep track of the button that is used to select a product and
   *  enter the augmented reality scene.
   *  @var      {Element}
   */
  _selectButton = null;

  /**
   *  We need to keep track of the texts that we need to display in scanner and
   *  the scene.
   *  @var      {object}
   */
  _texts = null;

  /**
   *  This is the promise for requesting the texts for this app.
   *  @var      {Promise}
   */
  _textsPromise = null;

  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element on which the product
   *                                  representation will be installed.
   *  @param    {array}     options   Parameters.
   *    @property {string}    appPath   The path that identifies the app that
   *                                    we should shown.
   *
   */
  constructor(parent, options = {}) {

    // Initialize the BaseElement class.
    super();

    // We need the Aframe and Quagga libraries for this. We should start loading
    // those libraries immediately.
    const quagga = "/quagga/quagga.min.js";
    const aframe = "/aframe/aframe.js";
    this._scriptLoader = new ScriptLoader([quagga, aframe]);

    // Get the object to make HTTP requests.
    this._request = new Request();

    // Next, start loading products.
    this._loadProducts(options.appPath);

    // We need to know what texts to display in the overlay elements.
    this._loadTexts(options.appPath);

    // Create a container for the overlay.
    this._container = document.createElement("div");
    this._container.classList.add("representation");

    // Listen for the scriptloader to load all scripts.
    this._scriptLoader.on("loaded-all", script => {

      // Wait for the HTTP response to get the app texts.
      this._textsPromise.then(response => {

        // Get access to the JSON object.
        if (response) return response.json().then(texts => {

          // Store the texts.
          this._texts = texts;

          // Now start the barcode scanner and the augmented reality scene.
          this._loadBarcodeScanner()
          this._loadArScene();
        });
      });
    });

    // Add the overlay to the parent container.
    parent.appendChild(this._container);
  }

  /**
   *  Private method to load the augmented reality scene.
   */
  _loadArScene = () => {

    // Create a new augmented reality scene.
    this._scene = new ArScene(this._container, this._texts);

    // Propagate any error events that the scene might trigger.
    this._scene.on("error", errorMessage => void this.trigger("error", errorMessage));

    // Listen for when the scene ends.
    this._scene.on('end', () => {

      // Hide the scene.
      this._scene.hide();

      // Start and show the barcode scanner again.
      this._scanner.start().show();
    });

    // Debounce the select handler.
    const selectHandler = debounce(this._selectProduct, 500);

    // Wait for the augmented reality scene to activate.
    this._scene.on('loaded', () => {

      // Listen to when a the user tries to select a product.
      this._selectButton.addEventListener('click', selectHandler);
      this._selectButton.addEventListener('touchend', selectHandler);

      // Enable the button if we've also selected a product.
      if (this._shownProduct) this._selectButton.disabled = false;
    });
  }

  /**
   *  Private method to load the barcode scanner.
   */
_loadBarcodeScanner = () => {

    // Create a new barcode scanner.
    this._scanner = new BarcodeScanner(this._container);

    // Propagate any error event that the scanner might trigger and simplify
    // the error message.
    this._scanner.on("error", () => void this.trigger("error", "Error: could not access camera"));

    // Listen to when the barcode scanner reads barcodes.
    this._scanner.on('scanned', this._processBarcode);

    // Get the overlay of the barcode scanner, so that we can configure it here.
    const scannerOverlay = this._scanner.overlay();

    // Add a title to the overlay.
    scannerOverlay.add("h1", {
      text:     this._texts["scanning-title"],
      location: "top",
    });

    // Add an instruction to the overlay.
    scannerOverlay.add("p", {
      text:     this._texts["scanning-description"],
      location: "top",
    });

    // Add a paragraph for displaying the scanned product to the user.
    this._productDisplay = scannerOverlay.add("p", {

      // We want to clearly show the user when we scan products.
      animated: true,
    });

    // Add a select button to the overlay.
    this._selectButton = scannerOverlay.add("button", {
      text: this._texts["scanning-button"],
    });

    // Disable the select button by default.
    this._selectButton.disabled = true;
  }

  /**
    *  Private method for selecting a product.
    *  @param  {Event}     event
    */
  _selectProduct = event =>  {

    // If we do have a product, we need to immediately stop and hide the
    // scanner.
    this._scanner.stop().hide();

    // Start and show the augmented reality session instead.
    this._scene.select(this._shownProduct.model);
  }

  /**
    *  Private method for processing a scanned barcode.
    *  @param  {object}      data      Update object.
    *    @property {integer}   code      Product barcode.
    */
  _processBarcode = data => {

    // If we cannot recognize this product, we can't do anything.
    if (!(data.code in this._products)) return;

    // No need to process if we're already showing this product.
    if (this._shownProduct && data.code == this._shownProduct.code) return;

    // Update the shown product.
    this._shownProduct = this._products[data.code];

    // Make sure we also remember the barcode of the shown product.
    this._shownProduct.code = data.code;

    // Show the user the product name of the selected product. We want to remove
    // the text first and reset it a moment later to trigger the animation
    // effect.
    this._productDisplay.textContent = '';
    setTimeout(() => { this._productDisplay.textContent = this._shownProduct.name }, 200);

    // Enable the button if the scene is also ready..
    if (this._scene.active()) this._selectButton.disabled = false;
  }

  /**
   *  Private method to load and store all products.
   *  @param    {string}    path        Path that identifies the app.
   */
  _loadProducts = path => {

    // Request all products. Store the resulting promise for cleanup purposes.
    this._productsPromise = this._request.get('/app/products/' + path)

      // Propagate errors.
      .catch(error => void this.trigger('error', error))

      // Wait for the HTTP response.
      .then(response => {

        // Get access to the JSON object.
        if (response) return response.json().then(products => {

          // Loop through all product and add the name and model to our product
          // dictionary, using the barcode as the key.
          for (const product of products) this._products[product.barcode] = {
            name:   product.name,
            model:  product.modelName,
          }
        });
      });
  }

  /**
   *  Private method to load and store all texts that we need for this
   *  representation.
   *  @param    {string}    path        Path that identifies the app.
   */
  _loadTexts = path => {

    // Request the app data. It should contain all the texts we need.
    this._textsPromise = this._request.get('/app/' + path)

      // Propagate errors.
      .catch(error => void this.trigger('error', error));
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Remove all classes that we've initialized.
    this._scanner.remove();
    this._scene.remove();
    this._request.remove();
    this._scriptLoader.remove();

    // Remove all references to DOM elements.
    this._productDisplay.remove();
    this._selectButton.remove();

    // Remove all objects.
    if (this._productsPromise) this._productsPromise.then(() => { delete this._products; });
    delete this._shownProduct;

    // Call the BaseElement's remove function.
    super.remove();
  }
}

// Export the Representation class so it can be imported elsewhere.
export { Representation };
