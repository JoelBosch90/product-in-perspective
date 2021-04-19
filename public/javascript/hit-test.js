/**
 *  Initial test script for placing a 3D object in a 2D camera view.
 */

/**
 *  Define the session type that we need.
 *  @var  string
 */
const sessionType = "immersive-vr";

/**
 *  Initialize an empty object to hold the XR session.
 *  @var  XRSession
 */
let xrSession = null;

/**
 *  Initialize an empty object to hold the reference space.
 *  @var ??
 */
let xrReferenceSpace = null;

/**
 *  A button to active XR.
 *  @var  Element
 */
const xrButton = document.createElement("button");

// Make sure the button is disabled by default.
xrButton.disabled = true;

// Add descriptive text to the button.
xrButton.textContent = "Enter XR";

// Add descriptive text and add the button to the DOM.
document.body.appendChild(xrButton);

/**
 *  A click handler for the XR button that can start or end an XR session.
 *  @param    Event                 event
 *  @returns  undefined
 */
const xrButtonClickHandler = event => {

  // If we don't have an active session, request one.
  if (!xrSession) {
    
    // As soon as we have the xr session, we want to start it.
    navigator.xr.requestSession(sessionType).then(session => {

        // Store the session.
        xrSession = session;

        // Update the XR button to do the opposite. We want to use it as a
        // toggle.
        xrButton.textContent = "Exit XR";

        // Run the function to handle the start of a new XR session.
        xrSessionStartHandler();
      });

    // After starting the session, we can exit the click handler.
    return;
  }

  // Otherwise, we can just end the current XR session.
  xrSession.end();

  // Update the button to reflect that we can start a new one.
  xrButton.textContent = "Enter VR";
};

/**
 *  A handler that can initialize an XR session.
 *  @returns  undefined
 */
const xrSessionStartHandler = () => {

  // Make sure we run the end handler once the XR session has ended.
  xrSession.addEventListener('end', xrSessionEndHandler);

  // Create a new canvas element.
  const canvas = document.createElement('canvas');

  // Get the WebGL rendering context.
  const renderingContext = canvas.getContext('webgl', { xrCompatible: true });

  // Associate a source of content with the canvas.
  xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(xrSession, renderingContext) })

  // Get a simple reference space. The 'local-floor' is a reference space that
  // picks an origin near the viewer and the y-axis at the floor level.
  xrSession.requestReferenceSpace('local-floor').then(referenceSpace => {

    // Store the reference space.
    xrReferenceSpace = referenceSpace;

    // Assign the frame handler.
    xrSession.requestAnimationFrame(xrFrameHandler);
  });
};

/**
 *  A handler that can clean up an XR session.
 *  @param    Event                 event
 *  @returns  undefined
 */
const xrSessionEndHandler = event => {

  // Reset the XR session object.
  xrSession = null;

  // Reset the XR button.
  xrButton.textContent = "Enter VR";  
};

/**
 *  Frame loop handler.
 *  @param    DOMHighResTimeStamp   time
 *  @param    XFrame                frame
 *  @returns  undefined
 */
const xrFrameHandler = (time, frame) => {

  // Get the XR frame's XR session.
  const frameSession = frame.session;

  // Immediately request the next frame to make sure we continue the frame loop.
  frameSession.requestAnimationFrame(xrFrameHandler);

  
};

// Check if WebXR is available on this device.
if (navigator.xr) {

  // Check if we can get a WebXR session.
  const supported = navigator.xr.isSessionSupported(sessionType);

  // If we can get a WebXR session, we want to enable the XR button so that
  // the user can start an XR session.
  if (supported) {
    xrButton.addEventListener(xrButtonClickHandler);
    xrButton.enabled = supported;
  }
}