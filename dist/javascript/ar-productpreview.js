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

// Create a tempory dictionary for products.
const products = {

  // These are the products that we can currently recognize. This is a
  // placeholder while we do not yet have a database set up.
  96181072: {
    name: "Eat Natural: protein packed with salted caramel and peanuts",
    class: 0
  },
  96187159: {
    name: "Eat Natural: simply vegan peanuts, coconut and chocolate",
    class: 1
  },
  96103890: {
    name: "Eat Natural: protein packed with peanuts and chocolate",
    class: 2
  },

  // This is the last product that was scanned.
  last: null
}

/**
 *  Create a barcode scanner object. We want to pass our container element so
 *  that it can create
 *  @var      {BarcodeScanner}
 */
const scanner = new BarcodeScanner(container);

// Get the overlay of the barcode scanner, so that we can configure it here.
const scannerOverlay = scanner.overlay();

// Add a title to the overlay.
scannerOverlay.add("h1", {
  text:     "How much plastic?",
  location: "top"
});

// Add a description to the overlay.
scannerOverlay.add("p", {
  text:     "Select a product after scanning a barcode.",
  location: "top"
});

// Add a product description to the overlay.
const productDescription = scannerOverlay.add("p");

// Add a select button to the overlay.
scannerOverlay.add("button", {
  text:     "Select product"
});

// Listen to when the barcode scanner reads barcodes.
scanner.on('scanned', data => {

  console.log('data', data);

  // If we recognize the product, register it.
  if (data.code in products) {

    // Update the last product.
    products.last = products[data.code];

    // Update the product description.
    productDescription.textContent = products.last.name;

    console.log('lastProduct', products.last);
  }
});