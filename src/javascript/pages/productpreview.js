/**
 *  Main file for the augmented reality product preview page. This is the master
 *  script that initialize the barcodescanner and the augmented reality scene
 *  and switches between them.
 */

// Import dependencies.
import { BarcodeScanner } from "/javascript/widgets/BarcodeScanner.js";
import { ArScene } from "/javascript/widgets/ArScene.js";
import { Apology } from "/javascript/widgets/Apology.js";
import { debounce } from "/javascript/tools/debounce.js";

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
    name:     "Eat Natural: protein packed with salted caramel and peanuts",
    category: 0
  },
  96187159: {
    name:     "Eat Natural: simply vegan peanuts, coconut and chocolate",
    category: 1
  },
  96103890: {
    name:     "Eat Natural: protein packed with peanuts and chocolate",
    category: 2
  },

  // This is the last product that was scanned.
  last: null
}

/**
 *  Create an augmented reality session object.
 *  @var      {ArScene}
 */
const arScene = new ArScene(container);

// Listen for errors from the ArScene object.
arScene.on("error", errorMessage => {

  // These are unrecoverable errors, so we can remove the scene.
  arScene.remove();

  // We should show the apologoy to the user.
  new Apology(container, errorMessage);
})

/**
 *  Create a barcode scanner object. We want to pass our container element so
 *  that it can create
 *  @var      {BarcodeScanner}
 */
const scanner = new BarcodeScanner(container);

// Listen for errors from the BarcodeScanner object.
scanner.on("error", errorMessage => {

  // These are unrecoverable errors, so we can remove the scene.
  scanner.remove();

  // We should show the apology to the user. The barcode scanner's error
  // messages are not always easy to understand, so instead we show the user the
  // easiest, most common error.
  new Apology(container, "Error: could not access camera");
})


// Get the overlay of the barcode scanner, so that we can configure it here.
const scannerOverlay = scanner.overlay();

// Add a title to the overlay.
scannerOverlay.add("h2", {
  text:     "Which product?",
  location: "top"
});

// Add an instruction to the overlay.
scannerOverlay.add("p", {
  text:     "Select a product after scanning a barcode.",
  location: "top"
});

// Add a paragraph for showing messages to the user.
const messageBus = scannerOverlay.add("p");

// Add a select button to the overlay.
const selectButton = scannerOverlay.add("button", {
  text:     "Select product"
});

// Disable the select button by default.
selectButton.disabled = true;

/**
 *  Helper function for updating a product.
 *  @param  {object}      data      Update object.
 *    @property {integer}   code      Product barcode.
 */
const updateProduct = data =>  {

  // If we cannot recognize this product, we can't do anything.
  if (!(data.code in products)) return;

  // No need to process if we've already registered this product.
  if (products.last && data.code == products.last.code) return;

  // Update the last product.
  products.last = products[data.code];
  products.last.code = data.code;

  // Show the user the product name of the selected product.
  messageBus.textContent = products.last.name;
}

/**
 *  Helper function for selecting a product.
 *  @param  {Event}     event
 */
const selectProduct = event =>  {

  // If we don't have a product yet, we should tell the user that he needs to
  // scan one before he can select it.
  if (!products.last) return messageBus.textContent = "First scan a product to select.";

  // If we do have a product, we need to immediately stop and hide the scanner.
  scanner.stop().hide();

  // Start and show the augmented reality session instead.
  arScene.select(products.last.category);
}

// Listen to when the barcode scanner reads barcodes.
scanner.on('scanned', updateProduct);

// Debounce the select handler.
const selectHandler = debounce(selectProduct, 500);

// Wait for the augmented reality scene to activate.
arScene.on('loaded', () => {

  // Listen to when a the user tries to select a product.
  selectButton.addEventListener('click', selectHandler);
  selectButton.addEventListener('touchend', selectHandler);

  // Enable the button.
  selectButton.disabled = false;
})

/**
 *  Helper function for resetting the page to the original state.
 *  @param  {Event}     event
 */
const resetPage = event => {

  // Make sure that the barcode scanner is active and visible.
  scanner.start().show();
}

// Listen for when the augmented reality session ends.
arScene.on('end', resetPage);

// // SHORTCUT FOR TESTING PURPOSES.
// updateProduct({ code: 96181072 });