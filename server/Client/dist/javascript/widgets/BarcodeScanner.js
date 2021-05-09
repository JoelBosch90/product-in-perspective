// Import dependencies.
import { BaseElement } from "/javascript/widgets/BaseElement.js";
import { Overlay } from "/javascript/widgets/Overlay.js";
/**
 *  The definition of the BarcodeScanner class that can be used to scan barcodes
 *  from the device camera.
 *
 *  @event      scanned       Triggered when a detected barcode could be read.
 *                            Provides the barcode's product number.
 *  @event      error         Triggered when an unrecoverable error has
 *                            occurred.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class BarcodeScanner extends BaseElement {
  /**
   *  Private variable that stores a reference to the overlay object.
   *  @var      {Overlay}
   */
  _overlay = null;
  /**
   *  Private variable that keeps track of the Quagga settings.
   *  @var      {object}    state     A state object to initialize Quagga.
   *    @property {object}    inputStream
   *    @property {object}    locator
   *    @property {integer}   numOfWorkers
   *    @property {integer}   frequency
   *    @property {object}    decoder
   *    @property {boolean}   locate
   */

  _state = null;
  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element on which the
   *                                  barcode scanner interface will be
   *                                  installed.
   */

  constructor(parent) {
    // Call the base class constructor.
    super(); // Initialize the interface for the barcode scanner. It should return a
    // container for the video element that Quagga creates.

    const videoContainer = this._initInterface(parent); // Store the Quagga state.


    this._state = {
      inputStream: {
        // We need the video stream for this class.
        type: "LiveStream",
        // A low resolution should work well enough. This should help
        // performance while a higher resolution might help detection.
        constraints: {
          width: {
            min: 1280
          },
          height: {
            min: 720
          },
          facingMode: "environment",
          aspectRatio: {
            min: 1,
            max: 2
          }
        },
        // Pass the container for the video element in the DOM.
        target: videoContainer
      },
      // Increasing workers might help performance on devices that have suffient
      // cores. We assume that this device will be used on mobile devices
      // mostly, so we don't assume multiple cores.
      numOfWorkers: 0,
      frequency: 10,
      // We want to be able to read all possible barcodes. This will likely
      // cause a performance hit and lead to an increase in false positives,
      // but we should be able to handle that quite well.
      decoder: {
        readers: [// These are the most used barcode formats for customer products:
        {
          format: "ean_reader",
          config: {}
        }, {
          format: "ean_8_reader",
          config: {}
        }, {
          format: "upc_reader",
          config: {}
        }, {
          format: "upc_e_reader",
          config: {}
        }, {
          format: "code_128_reader",
          config: {}
        } // Optionally, we could expand to also use the following formats:
        // { format: "code_39_reader", config: {} },
        // { format: "code_39_vin_reader", config: {} },
        // { format: "codabar_reader", config: {} },
        // { format: "i2of5_reader", config: {} },
        // { format: "2of5_reader", config: {} },
        // { format: "code_93_reader", config: {} },
        ],
        // We don't need to detect multiple barcodes simultaneously.
        multiple: false
      },
      // We want to detect barcodes even if they do not align perfectly with the
      // frame of the camera.
      locate: true,
      // Increasing these settings will help detection, but not as much as
      // increasing the resolution. It is better for performance to keep these
      // low if our accuracy is sufficient.
      locator: {
        patchSize: "medium",
        halfSample: true
      }
    }; // Initialize Quagga.

    this._initQuagga();
  }
  /**
   *  Private method for initializing Quagga.
   *  @param    {object}    state     A state object to initialize Quagga.
   *    @property {object}    inputStream
   *    @property {object}    locator
   *    @property {integer}   numOfWorkers
   *    @property {integer}   frequency
   *    @property {object}    decoder
   *    @property {boolean}   locate
   */


  _initQuagga = () => {
    // Initialize the barcode scanner.
    this.start(); // Handle cases when Quagga has read a barcode.

    Quagga.onDetected(result => {
      // Get the barcode that was read.
      const code = result.codeResult.code; // Trigger the event immediately.

      this.trigger('scanned', {
        code
      });
    });
  };
  /**
   *  Private method for initializing the DOM interface.
   *  @param    {Element}   parent    The parent element on which the
   *                                  barcode scanner interface will be
   *                                  installed.
   *  @returns  {Element}   The container for the video element.
   */

  _initInterface = parent => {
    // Create a container for the barcode scanner.
    this._container = document.createElement("div"); // Add the styling class to the container element.

    this._container.classList.add("barcodescanner"); // Create a container for the video element.


    const video = document.createElement("div"); // Add the styling class to the container element.

    video.classList.add("barcodescanner-video"); // Append the video container to the overall container.

    this._container.appendChild(video); // Create the overlay in this container.


    this._initOverlay(this._container); // Add the entire interface to the parent container.


    parent.appendChild(this._container); // Return the container for the video element.

    return video;
  };
  /**
   *  Private method for creating an overlay for the interface.
   *  @param    {Element}   parent    The parent element on which the overlay
   *                                  interface will be installed.
   */

  _initOverlay = parent => {
    // Create a container for the overlay element.
    const container = document.createElement("div"); // Add the styling class to the container element.

    container.classList.add("barcodescanner-overlay"); // Create an overlay object.

    this._overlay = new Overlay(container); // Add the overlay container to the parent container.

    parent.appendChild(container);
  };
  /**
   *  Private method for handling errors.
   *  @param    {string}    error     A string describing the error that has
   *                                  occurred.
   */

  _handleError = error => void this.trigger("error", error);
  /**
   *  Method to expose the Overlay object.
   *  @returns  {Overlay}
   */

  overlay = () => {
    // Expose the overlay element.
    return this._overlay;
  };
  /**
   *  Method to start scanning.
   *  @var      {object}    state     A state object to initialize Quagga.
   *    @property {object}    inputStream
   *    @property {object}    locator
   *    @property {integer}   numOfWorkers
   *    @property {integer}   frequency
   *    @property {object}    decoder
   *    @property {boolean}   locate
   *  @returns  {BarcodeScanner}
   */

  start = (state = this._state) => {
    // Initialize the Quagga object.
    Quagga.init(state, error => {
      // Handle errors with our own error handler.
      if (error) return this._handleError(error); // Start Quagga so that we start processing the video feed.

      Quagga.start();
    }); // Allow chaining.

    return this;
  };
  /**
   *  Method to stop scanning.
   *  @returns  {BarcodeScanner}
   */

  stop = () => {
    // Stop Quagga so that we stop processing the video feed.
    Quagga.stop(); // Allow chaining.

    return this;
  };
  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */

  remove() {
    // Delete the state.
    delete this._state; // Remove class objects we used.

    this._overlay.remove(); // Call the original remove function.


    super.remove();
  }

} // Export the BarcodeScanner class so it can be imported elsewhere.


export { BarcodeScanner };