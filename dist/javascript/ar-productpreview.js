/**
 *  Main file for the augmented reality product preview page. This is the master
 *  script that initialize the barcodescanner and the augmented reality scene
 *  and switches between them.
 */

// Import dependencies.
import { BarcodeScanner } from "/javascript/BarcodeScanner.js"

/**
 *  This is the container for the entire application. Because we want to use the
 *  full page, we can simply use the document's body element.
 *  @var      {Element}
 */
const container = document.body;

/**
 *  Create a barcode scanner object. We want to pass our container element so
 *  that it can create
 *  @var      {BarcodeScanner}
 */
const scanner = new BarcodeScanner(container);

