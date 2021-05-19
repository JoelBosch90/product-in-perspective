/**
 *  The definition of the AttributeObserver class that can be used to observe
 *  attribute changes for certain DOM elements. It behaves much like the
 *  EventHandler class, except instead of event names, it accepts DOM elements.
 *  The important differences with the EventHandler class are that this class
 *  only allows for one callback per target, and it cannot be manually
 *  triggered. Instead, it is automatically triggered by mutations on the target
 *  element.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class AttributeObserver {

  /**
   *  Private variable for targets to track.
   *  @var      object
   */
  _targets = new Map();

  /**
   *  We want to keep track of the running mutation observer.
   *  @var  {MutationObserver}
   */
  _observer = null;

  /**
   *  Class constructor.
   */
  constructor() {

    // Create a new Mutation observer.
    this._observer = new MutationObserver(mutations => {

      // Loop through all mutations.
      for (const mutation of mutations) {

        // If this is not a mutation to the attributes of the target element, we
        // should ignore this mutation.
        if (mutation.type != 'attributes') return;

        // Call the callback function that we've registered for this target, if
        // any.
        if (this._targets.has(mutation.target)) this._targets.get(mutation.target)(mutation);
      }
    })
  }

  /**
   *  Method to show this element.
   *  @param    {Element}     target  DOM element that is to be observed for
   *                                  attribute changes.
   *  @returns  {AttributeObserver}
   */
  on(target, callback) {

    // We only know how to handle DOM elements.
    if (!target instanceof Element) return;

    // Add this target to our mapping.
    this._targets.set(target, callback);

    // Start observing the target.
    this._observer.observe(target, {attributes: true});

    // Allow chaining.
    return this;
  }

  /**
   *  Method to remove this object and clean up after itself. We have to use
   *  non-arrow function or we'd lose the super context.
   */
  remove() {

    // Can't remove anything if it has already been removed.
    if (!this._observer) return;

    // Disconnect the observer.
    this._observer.disconnect();

    // Remove the reference to the observer so that it can be garbage collected.
    this._observer = null;

    // Clear all targets.
    this._targets.clear();
  }
}

// Export the AttributeObserver class so it can be imported elsewhere.
export { AttributeObserver };
