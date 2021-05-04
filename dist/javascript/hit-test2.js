/**
 *  Initial test script for placing a 3D object in a 2D camera view.
 */

/**
 *  Define the session type that we need to create an immersive AR session.
 *  @var  string
 */
const sessionType = "immersive-ar";
/**
 *  Initialize an empty variable to hold the XR session.
 *  @var  XRSession
 */

let xrSession = null;
/**
 *  Initialize an empty variable to hold the reference space.
 *  @var  XRReferenceSpace
 */

let xrReferenceSpace = null;
/**
 *  Initialize an empty variable to hold the viewer space.
 *  @var  XRReferenceSpace
 */

let xrViewerSpace = null;
/**
 *  Initialize an empty variable to hold the hit test source.
 *  @var  ??
 */

let xrHitTestSource = null;
/**
 *  Initialize an empty variable to hold the rendering context.
 *  @var WebGLRenderingContext
 */

let renderingContext = null;
/**
 *  @TODO We need a WebGL or WebGL2 element here to draw a reticle.
 *  @var  object
 */

const reticle = {};
/**
 *  A button to active XR.
 *  @var  Element
 */

const xrButton = document.createElement("button"); // Make sure the button is disabled by default.

xrButton.disabled = true; // Add descriptive text to the button.

xrButton.textContent = "Enter XR"; // Add descriptive text and add the button to the DOM.

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
    navigator.xr.requestSession(sessionType, {
      requiredFeatures: ['local', 'hit-test']
    }).then(session => {
      // Store the session.
      xrSession = session; // Update the XR button to do the opposite. We want to use it as a
      // toggle.

      xrButton.textContent = "Exit XR"; // Run the function to handle the start of a new XR session.

      xrSessionStartHandler();
    }); // After starting the session, we can exit the click handler.

    return;
  } // Otherwise, we can just end the current XR session.


  xrSession.end(); // Update the button to reflect that we can start a new one.

  xrButton.textContent = "Enter XR";
};
/**
 *  A handler that can initialize an XR session.
 *  @returns  undefined
 */


const xrSessionStartHandler = () => {
  // Install our event handlers.
  xrSession.addEventListener('end', xrSessionEndHandler);
  xrSession.addEventListener('select', xrSessionSelectHandler); // @TODO Do we need to remove a background here?
  // Create a new canvas element.

  const canvas = document.createElement('canvas'); // Get the WebGL rendering context.

  renderingContext = canvas.getContext('webgl', {
    xrCompatible: true
  }); // Associate a source of content with the canvas.

  xrSession.updateRenderState({
    baseLayer: new XRWebGLLayer(xrSession, renderingContext)
  }); // Get a reference space for the hit test.

  xrSession.requestReferenceSpace('viewer').then(referenceSpace => {
    // Store the reference space.
    xrViewerSpace = referenceSpace; // Request and store the hit test source.

    xrSession.requestHitTestSource({
      space: xrViewerSpace
    }).then(hitTestSource => {
      xrHitTestSource = hitTestSource;
    });
  }); // Get a reference space for the viewer.

  xrSession.requestReferenceSpace('local').then(referenceSpace => {
    // Store the reference space.
    xrReferenceSpace = referenceSpace; // Assign the frame handler.

    xrSession.requestAnimationFrame(xrFrameHandler);
  });
};
/**
 *  A handler that can process a click event during an XR session.
 *  @param    Event                 event
 *  @returns  undefined
 */


const xrSessionSelectHandler = event => {
  // It only makes sense to process a click event if the reticle is visible.
  if (!reticle.visible) return; // @TODO add the AR object at the reticle.matrix position.
};
/**
 *  A handler that can clean up an XR session.
 *  @param    Event                 event
 *  @returns  undefined
 */


const xrSessionEndHandler = event => {
  // Reset the XR session object.
  xrSession = null; // Reset the XR button.

  xrButton.textContent = "Enter XR";
};
/**
 *  Frame loop handler.
 *  @param    DOMHighResTimeStamp   time
 *  @param    XFrame                frame
 *  @returns  undefined
 */


const xrFrameHandler = (time, frame) => {
  // Get the XR frame's XR session.
  const frameSession = frame.session; // Immediately request the next frame to make sure we continue the frame loop.

  frameSession.requestAnimationFrame(xrFrameHandler); // Get the XR viewer pose from the reference space.

  const viewerPose = frame.getViewerPose(xrReferenceSpace); // We only want to draw the reticle when we have a valid hit test. That is why
  // the reticle is hidden by default.
  // @TODO Apply to actual reticle.

  reticle.visible = false; // Did we get a valid XR viewer pose? It could be lost or blocked. In that
  // case we want to forego rendering this frame. We've already requested the
  // next animation frame so that we can continue when the pose has been
  // recovered.

  if (!viewerPose) return; // Did we get a valid hit source for this session?

  if (xrHitTestSource) {
    // Get the hit test results for this XR frame.
    const hitTestResults = frame.getHitTestResults(xrHitTestSource); // Did we get a valid hit for the test?

    if (hitTestResults.length > 0) {
      // Get the pose for the first hit. This should be the one closest to the
      // camera.
      const pose = hitTestResults[0].getPose(xrReferenceSpace); // Now we can show the reticle.
      // @TODO Apply to actual reticle.

      reticle.visible = true; // Apply the hit test transformation matrix to the reticle.
      // @TODO Apply to actual reticle.

      reticle.matrix = pose.transform.matrix;
    }
  } // Get the XRWebGLLayer from the XR session.


  const glLayer = xrSession.renderState.baseLayer; // We need to provide the WebGL rendering context with the framebuffer.

  renderingContext.bindFramebuffer(renderingContext.FRAMEBUFFER, glLayer.framebuffer); // Iterate over the views in the XR viewer pose. Mobile devices have only the
  // one view, but wearables may have more than one, like one for each eye.

  for (const view of viewerPose.views) {
    // Get the coordinates and dimensions that are specific to the device.
    const viewport = glLayer.getViewport(view); // Provide the viewport to the WebGL rendering context.

    renderingContext.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
  }
}; // Check if WebXR is available on this device.


if (navigator.xr) {
  // Check if we can get a WebXR session.
  const supported = navigator.xr.isSessionSupported(sessionType); // If we can get a WebXR session, we want to enable the XR button so that
  // the user can start an XR session.

  if (supported) {
    xrButton.addEventListener("click", xrButtonClickHandler);
    xrButton.disabled = !supported;
  }
}