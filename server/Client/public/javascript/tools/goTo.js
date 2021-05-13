/**
 *  Helper function to visit any page in the app without refreshing the page.
 *
 *  @param    {string}      path    Path to visit.
 */
const goTo = path => {
  // The History API is a little weird in that it requires the path argument
  // last, whereas we don't need the first (state) and second (title) arguments.
  history.pushState({}, '', path); // The history.pushState does not trigger the popstate event, but we do rely
  // on this for routing, so we want to trigger that manually.

  dispatchEvent(new PopStateEvent('popstate', {
    state: {}
  }));
}; // Export the goTo function.


export { goTo };