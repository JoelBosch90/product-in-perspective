/**
 *  The definition of the HitTest class that can be used to perform a WebXR hit
 *  test.
 *
 *  This class is based on an example by Ada Rose Cannon.
 *  Source: https://medium.com/samsung-internet-dev/making-an-ar-game-with-aframe-529e03ae90cb
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class HitTest {

  /**
   *  Private variable that stores the renderer.
   *  @var      {WebGLRenderer}
   */
  _renderer = null;

  /**
   *  Private variable that stores the XRHitTestSource.
   *  @var      {XRHitTestSource}
   */
  _hitTestSource = null;

  /**
   *  Private variable that stores the WebXR session.
   *  @var      {XRSession}
   */
  _session = null;

  /**
   *  Private variable that stores the options object.
   *  @var      {object}
   *    @property   {string}      profile   String describing the input profile.
   *    @property   {XRSpace}     space     WebXR reference space object for the
   *                                        target ray space.
   */
  _options = null;

  /**
   *  Class constructor.
   *  @param    {WebGLRenderer} renderer  The renderer from a WebXR session.
   *  @param    {object}        options   Optional option parameters.
   *    @property   {string}      profile   String describing the input profile.
   *    @property   {XRSpace}     space     WebXR reference space object for the
   *                                        target ray space.
   */
  constructor(renderer, options) {

    // Store the XR renderer.
    this._renderer = renderer;

    // Store the options.
    this._options = options;

    // Make sure we reset the hit test source every time the session ends.
    this._renderer.xr.addEventListener("sessionend", () => this._resetHitTestSource());

    // Make sure we start whenever the session starts.
    this._renderer.xr.addEventListener("sessionstart", () => this._onSessionStart());

    // If the WebXR session has already started, we should immediately start the
    // hit test session.
    if (this._renderer.xr.isPresenting) this._onSessionStart();
  }

  /**
   *  Event listener for when the WebXR session ends. It simply resets the hit
   *  test source.
   */
  _resetHitTestSource() {

    // Simply set it back to null.
    this._hitTestSource = null;
  }

  /**
   *  Event listener for when the WebXR session starts.
   *  @returns  {XRHitTestSource}
   */
  async _onSessionStart() {

    // Store the current WebXR session.
    this._session = this._renderer.xr.getSession();

    // If we have a ray space, use that to get the source for the hit test.
    if (this._options.space) return this._hitTestSource = await this._session.requestHitTestSource(this._options);

    // If we are dealing with transient input, use that to get the source for
    // the hit test.
    if (this._options.profile) return this._hitTestSource = await this._session.requestHitTestSourceForTransientInput(this._options);
  }

  /**
   *  Method to do a hit test for a single frame.
   *  @param    {XRFrame}       frame   The frame that the hit test will be done
   *                                    for.
   *  @returns  {object | false}        An object describing the input space and
   *                                    the pose of the hit location. Or false
   *                                    if the hit test was unsuccessful.
   */
  doHit(frame) {

    // If we're not in an active session, we cannot do a hit test.
    if (!this._renderer.xr.isPresenting) return;

    // Get a reference space for this WebXR session.
    const referenceSpace = this._renderer.xr.getReferenceSpace();

    // We need both a source for the hit test and there should be a viewer pose,
    // otherwise we cannot do a hit test.
    if (!(this._hitTestSource && frame.getViewerPose(referenceSpace))) return;

    // If we have a profile, we'll need to do a transient hit test.
    if (this._options.profile) return this._transientHitTest(frame, referenceSpace);

    // Otherwise, we can do a normal hit test.
    return this._hitTest(frame, referenceSpace);
  }

  /**
   *  Private method to do a normal hit test.
   *  @param {XRFrame}          frame           The frame for the hit test.
   *  @param {XRReferenceSpace} referenceSpace  Coordinate system.
   *  @returns  {object | false}                An object describing the input
   *                                            space and the pose of the hit
   *                                            location. Or false if the hit
   *                                            test was unsuccessful.
   */
  _hitTest(frame, referenceSpace) {

    // Get the hit test results for this frame.
    const results = frame.getHitTestResults(this._hitTestSource);

    // If we didn't get any results, we should return false.
    if (results.length <= 0) return false;

    // Get the pose of the first result of the hit test. This should be the one
    // closest to the viewer and thus most likely to be the most relevant one.
    const pose = results[0].getPose(referenceSpace);

    // The hit test was succesful, so we can return the pose of the most
    // relevant hit test result and we can use the target ray space that was
    // provided  with the options.
    return {
      pose,
      inputSpace: this._options.space
    }
  }

  /**
   *  Private method to do a hit test for a transient input.
   *  @param {XRFrame}          frame           The frame for the hit test.
   *  @param {XRReferenceSpace} referenceSpace  Coordinate system.
   *  @returns  {object | false}                An object describing the input
   *                                            space and the pose of the hit
   *                                            location. Or false if the hit
   *                                            test was unsuccessful.
   */
  _transientHitTest(frame, referenceSpace) {

    // Get the transient input hit test results for this frame.
    const results = frame.getHitTestResultsForTransientInput(this._hitTestSource);

    // If we didn't get any results, we should return false.
    if (!results.length) return false;

    // Get the first result of the hit test. It should be the one closest to the
    // viewer and thus most likely the most relevant one.
    const closest = results[0];

    // If the closest result is empty, we have nothing to process.
    if (!closest.length) return false;

    // Get the pose for the closest result.
    const pose = closest[0].getPose(referenceSpace);

    // The hit test was succesful, so we can return the pose of the most
    // relevant hit test result and we can use the target ray that came with the
    // test.
    return {
      pose,
      inputSpace: results[0].inputSource.targetRaySpace
    }
  }

  /**
   *  Method to remove this object and clean up after itself.
   *  @returns  {HitTest}
   */
  remove() {

    // This class does not have any elements in the DOM, does not use any other
    // custom classes, or uses any event handlers that need to be removed.

    // Allow chaining.
    return this;
  }
}

// Export the HitTest class so it can be imported elsewhere.
export { HitTest };