// Import dependencies.
import { BarcodeScanner } from "/javascript/BarcodeScanner.js";
import { debounce } from "/javascript/debounce.js"; // Find our scene elements.

const scene = document.querySelector('a-scene');
const reticle = document.querySelector("[ar-hit-test]");
const box = document.getElementById('box'); // Find the overlay elements.

const productDescription = document.getElementById('product-description');
const arInstructions = document.getElementById('instructions');
const progressButton = document.getElementById('progress-button');
const exitButton = document.getElementById('exit-button'); // Declare constants.

const upVector = new THREE.Vector3(0, 1, 0);
const tempVector = new THREE.Vector3();
const tempQuaternion = new THREE.Quaternion(); // Create a tempory dictionary for products.

const products = {
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
  }
}; // Keep track of the product that was last scanned.

let lastProduct = null; // Create a barcode scanner object.

const scanner = new BarcodeScanner(document.body.querySelector('#barcodescanner-view')); // Listen to when the barcode scanner reads barcodes.

scanner.on('scanned', data => {
  console.log('data', data); // If we recognize the product, register it.

  if (data.code in products) {
    // Update the last product.
    lastProduct = products[data.code]; // Update the product description.

    productDescription.textContent = lastProduct.name;
    console.log('lastProduct', lastProduct);
  }
});
/**
 *  Helper function to switch to a different mode in the DOM by switching
 *  classes on an element.
 */

const switchMode = (element, mode) => {
  console.log("::switchMode", element, mode); // Get the classList of the element we want to switch to a different mode.

  const classList = element.classList; // Remove all possible modes from this classList.

  ["scanning", "placing", "viewing"].forEach(mode => void classList.remove(mode)); // Add only the new mode.

  classList.add(mode);
};
/**
 *  Helper function to check if a DOM is in a certain mode by checking for that
 *  class on the element.
 */


const inMode = (element, mode) => {
  // Get the classList of the element we want to switch to a different mode.
  const classList = element.classList; // Simply check if the classList contains the requested mode.

  return classList.contains(mode);
};
/**
 *  Function to initialize a virtual reality session.
 *  @TODO This still needs to be implemented.
 */


const initVR = () => {
  // Log an error.
  console.error("VR mode is not yet supported."); // Display the error to the user.

  arInstructions.textContent = "VR mode is not yet supported.";
};
/**
 *  Helper function to check if the session has an overlay.
 *  @param    XRSession   session
 *  @returns  boolean
 */


function hasDOMOverlay(session) {
  // Check that there is a DOM overlay state and that is being used.
  return !!(session.domOverlayState && session.domOverlayState.type);
}
/**
 *  Function to initialize an augmented reality session.
 */


const initAR = () => {
  console.log("::initAR"); // Show the AR scene.

  scene.setAttribute('visible', 'true'); // @TODO figure out how this works. It looks like this has something to do
  // with the overlay buttons.

  document.getElementById('ar-interface').setAttribute('text', 'value', 'Overlay: ' + hasDOMOverlay(scene.xrSession)); // Enter scanning mode.

  enterPlacingMode();
};
/**
 *  Function to enter the scanning mode. This is a mode in which the
 *  barcodescanner is active and all other elements are disabled.
 */


const enterScanningMode = () => {
  // Hide the AR scene.
  scene.setAttribute('visible', 'false'); // Make sure the parent element is in scanning mode.

  switchMode(document.body, "scanning"); // We don't need the hit test on the reticle for the scanning mode.

  reticle.setAttribute('ar-hit-test', 'doHitTest:false'); // Make sure the AR elements are not visible.

  reticle.setAttribute('visible', 'false');
  box.setAttribute('visible', 'false'); // Start scanning for products.

  scanner.start();
};
/**
 *  Function to enter the placing mode.
 */


const enterPlacingMode = () => {
  // Immediately stop scanning for products.
  scanner.stop(); // Make sure the parent element is in placing mode.

  switchMode(document.body, "placing"); // We need the hit test on the reticle for the placing mode.

  reticle.setAttribute('ar-hit-test', 'doHitTest:true'); // Make sure the reticle is visible.

  reticle.setAttribute('visible', 'true'); // Make sure the box is not visible.

  box.setAttribute('visible', 'false'); // Update the text on the progress button.

  progressButton.textContent = "Place"; // Update the text for the instructions.

  arInstructions.textContent = "Select a location to place the object.";
};
/**
 *  Function to enter the viewing mode.
 */


const enterViewingMode = () => {
  // Make sure the parent element is in viewing mode.
  switchMode(document.body, "viewing"); // Make sure the reticle is not visible.

  reticle.setAttribute('visible', 'false'); // We don't need the hit test on the reticle for the viewing mode.

  reticle.setAttribute('ar-hit-test', 'doHitTest:false'); // We can copy the position of the reticle to place the box in the scene.

  box.setAttribute("position", reticle.getAttribute("position")); // @TODO figure out what this does.

  tempVector.set(0, 0, -1);
  tempVector.applyQuaternion(reticle.object3D.quaternion);
  tempQuaternion.setFromUnitVectors(tempVector, upVector);
  box.object3D.quaternion.multiplyQuaternions(tempQuaternion, reticle.object3D.quaternion); // Make sure the box is visible.

  box.setAttribute('visible', 'true'); // Update the text on the progress button.

  progressButton.textContent = "Scan again"; // Update the text for the instructions.

  arInstructions.textContent = "View the object.";
};
/**
 *  Function to progress through modes.
 */


const enterNextMode = () => {
  // Get the parent element that has the mode class on it.
  const parent = document.body; // If we're placing, we want to finish the hit test and view the
  // representation object.

  if (inMode(parent, "placing")) return enterViewingMode(); // If we're viewing, we want to start over and scan a new product.

  if (inMode(parent, "viewing")) return scene.xrSession.end();
}; // Reset the scene after we exit XR mode.


scene.addEventListener("exit-vr", event => void enterScanningMode()); // Prepare the scene once we enter XR mode.

scene.addEventListener("enter-vr", event => {
  console.log("@enter-vr"); // We can only initialize the augmented reality session if the scene has
  // successfully entered AR mode.

  if (scene.is("ar-mode")) return initAR(); // We can only initialize the augmented reality session if the scene has
  // successfully entered AR mode.

  if (scene.is("vr-mode")) return initVR(); // If we end up here, something went wrong. We should inform the user and end
  // the session.

  console.error("Could not enter XR mode.");
  scene.xrSession.end();
}); // Make sure that the user can always exit the VR session with the Exit button.

exitButton.addEventListener('click', function () {
  scene.xrSession.end();
}); // Make sure users don't accidentally go through the phases too quickly.

const debouncedNextMode = debounce(enterNextMode, 500); // Register button clicks.

progressButton.addEventListener('mousedown', debouncedNextMode);
progressButton.addEventListener('touchstart', debouncedNextMode); // Hide the AR scene.

scene.setAttribute('visible', 'false'); // Make sure the parent element is in scanning mode.

switchMode(document.body, "scanning"); // We don't need the hit test on the reticle for the scanning mode.

reticle.setAttribute('ar-hit-test', 'doHitTest:false'); // Make sure the AR elements are not visible.

reticle.setAttribute('visible', 'false');
box.setAttribute('visible', 'false');