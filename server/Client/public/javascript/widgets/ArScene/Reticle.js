// Import dependencies.
import { HitTest } from "/javascript/widgets/ArScene/HitTest.js";
/**
 *  The definition of the Reticle class that can be used to create a reticle
 *  element in an Aframe scene that can be used to detect surfaces.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */

class Reticle {
  /**
   *  Private variable that stores a reference to the container element in the
   *  DOM.
   *  @var      {Element}
   */
  _container = null;
  /**
   *  Private variable that stores a cache for the hit test.
   */

  _cache = new Map();
  /**
   *  Class constructor.
   *  @param    {Element}   parent    The parent element to which the reticle
   *                                  will be added.
   */

  constructor(parent) {
    // First, register the Aframe primitive so that we can use the <a-reticle>
    // element in the DOM.
    this._registerPrimitive('ar-hit-test'); // Create an Aframe reticle element. This is the functional element that
    // will be doing the hit tests so that it can detect surfaces.


    this._container = document.createElement("a-reticle");

    this._container.classList.add("arscene-reticle"); // We don't need to start hit testing right away and the reticle should be
    // hidden by default.


    this._container.setAttribute("testing", "false");

    this._container.setAttribute("visible", "false"); // Start at the origin.


    this._container.setAttribute("position", "0 0 0");

    this._container.setAttribute("rotation", "0 0 0"); // Create an Aframe plane element that will be the visible part of the
    // reticle. It will server as a hit marker.


    const marker = document.createElement("a-plane"); // We need the marker to be flat on the ground, so we rotate by 90 degrees.

    marker.setAttribute("rotation", "-90 0 0"); // We need to give it some modest dimensions. The reticle should be easy to
    // spot and use, but should not hide the environment.

    marker.setAttribute("width", "0.2");
    marker.setAttribute("height", "0.2"); // Determine what the reticle looks like.

    marker.setAttribute("src", "/images/arrowTransparent.png");
    marker.setAttribute("material", "transparent:true;"); // Add the marker to the reticle.

    this._container.appendChild(marker); // Add the reticle to the parent element.


    parent.appendChild(this._container);
  }
  /**
   *  Private method to register the a-reticle primitive element with AFRAME so
   *  that we can use that element in within the a-scene container in the DOM.
   *  @param    {string}    name    Name of the AR hit test component.
   */


  _registerPrimitive = name => {
    // First register the hit test component that we need for this primitive.
    this._registerComponent(name); // Then register the primitive element so that we can use the <a-reticle>
    // element in the DOM within the <a-scene> element.


    AFRAME.registerPrimitive('a-reticle', {
      /**
       *  These are the preset default components. Here we can install
       *  components and default component properties.
       */
      defaultComponents: {
        // Use our hit test component so that we can use the reticle to detect
        // surfaces.
        'ar-hit-test': {},
        // We want the reticle to be flat on the floor, so we need to rotate 90
        // degrees around the x-axis.
        rotation: {
          x: -90,
          y: 0,
          z: 0
        }
      },

      /**
       *  These are the HTML attributes for the reticle.
       */
      mappings: {
        // We want to map the HTML attribute for the target and the hit test to
        // the hit test component.
        target: name + '.target',
        testing: name + '.doHitTest'
      }
    });
  };
  /**
   *  Private method to register the hit test component with AFRAME that the
   *  a-reticle element relies on to perform the hit tests.
   *  @param    {string}    name    Name of the AR hit test component.
   */

  _registerComponent = name => {
    AFRAME.registerComponent(name, {
      /**
       *  Here we can define the properties of the object. We can determine
       *  their types and default values.
       */
      schema: {
        // ???
        target: {
          type: "selector"
        },
        // We want to keep track of whether we are currently performing hit
        // tests or not.
        doHitTest: {
          type: 'boolean',
          default: true
        }
      },

      /**
       *  This function is always called once during the beginning of the
       *  lifecycle of the component. We can use it to declare some variables on
       *  the component and add event listeners.
       */
      init: function () {
        // We want to keep track of the HitTest object that we've previously
        // instantiated.
        this.hitTest = null; // We want to keep track of whether we've already found a pose or not.

        this.hasFoundAPose = false; // Event handler for when the ession ends.

        this.onSessionEnd = () => {
          // When the session ends, we want to reset our state variables.
          this.hitTest = null;
          this.hasFoundAPose = false;
        }; // Event handler for when the ession starts.


        this.onSessionStart = async () => {
          // Get the renderer and the session from the element.
          const renderer = this.el.sceneEl.renderer;
          const session = this.session = renderer.xr.getSession(); // this.hasFoundAPose = false;
          // By default, we want to user to be able to place the reticle by
          // pointing their camera around. That is why we use the reference
          // space from the viewer's point of view here.

          const viewerSpace = await session.requestReferenceSpace('viewer');
          const viewerHitTest = new HitTest(renderer, {
            space: viewerSpace
          });
          this.hitTest = viewerHitTest;
        }; // Listen for the WebXR session to start and end.


        this.el.sceneEl.renderer.xr.addEventListener("sessionstart", this.onSessionStart);
        this.el.sceneEl.renderer.xr.addEventListener("sessionend", this.onSessionEnd);
      },

      /**
       *  Method that is called on each frame of the scene's render loop.
       *  @param  {integer}   time      Number of milliseconds that have passed
       *                                since the start of the session.
       *  @param  {integer}   timeDelta Number of milliseconds that have passed
       *                                since the last frame.
       */
      tick: function (time, timeDelta) {
        // If we are not tasked with doing a hit test, we shouldn't do anything.
        if (!this.data.doHitTest) return; // Get access to the current frame.

        const frame = this.el.sceneEl.frame; // If there is no frame, we cannot perform a hit test.

        if (!frame) return; // If we don't have an instance of a HitTest, we cannot perform the hit
        // test for this frame.

        if (!this.hitTest) return; // Perform the hit test for this frame.

        const result = this.hitTest.doHit(frame); // If there is no result, the hit test failed and we should probably not
        // display the reticle for this frame.

        if (!result) return this.el.setAttribute('visible', false); // Get the pose and the appropriate input space from the results of
        // the hit test.

        const {
          pose,
          inputSpace
        } = result; // Try to get the pose for this frame.

        try {
          this.currentControllerPose = frame.getPose(inputSpace, this.el.sceneEl.renderer.xr.getReferenceSpace());
        } // Log any errors that occur.
        catch (error) {
          console.error(e);
        } // Remember that we've now found a pose.


        this.hasFoundAPose = true; // Make the reticle visible and update its position and orientation.

        this.el.setAttribute('visible', true);
        this.el.setAttribute("position", pose.transform.position);
        this.el.object3D.quaternion.copy(pose.transform.orientation);
      },

      /**
       *  Method that is called when the component or its parent element is
       *  removed. We can use it to clean up memory.
       */
      remove: function () {
        // Remove the event listeners from the WebXR session.
        this.el.sceneEl.renderer.xr.removeEventListener("sessionstart", this.onSessionStart);
        this.el.sceneEl.renderer.xr.removeEventListener("sessionend", this.onSessionEnd);
      }
    });
  };
  /**
   *  Method to expose the reticle's position attributes.
   *  @returns  {string}
   */

  position = () => {
    return this._container.getAttribute("position");
  };
  /**
   *  Method to expose the reticle's rotation attributes.
   *  @returns  {string}
   */

  rotation = () => {
    return this._container.getAttribute("rotation");
  };
  /**
   *  Method to show the scene.
   *  @returns  {Reticle}
   */

  show = () => {
    // Make sure we're not hiding the reticle and that we're performing hit
    // tests.
    this._container.setAttribute("testing", "true");

    this._container.setAttribute("visible", "true"); // Allow chaining.


    return this;
  };
  /**
   *  Method to hide the scene.
   *  @returns  {Reticle}
   */

  hide = () => {
    // Make sure we're hiding the reticle. We also don't need to perfom hit
    // tests while the reticle is hidden.
    this._container.setAttribute("visible", "false");

    this._container.setAttribute("testing", "false"); // Allow chaining.


    return this;
  };
  /**
   *  Method to remove this object and clean up after itself.
   */

  remove = () => {
    // Remove the DOM elements.
    this._container.remove(); // Clear the cache


    this._cache.clear();
  };
} // Export the Reticle class so it can be imported elsewhere.


export { Reticle };