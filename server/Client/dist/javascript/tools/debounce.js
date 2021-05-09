/**
 *  Helper function to debounce the execution of an action. The function that is
 *  passed will be executed after the given delay. This delay is reset every
 *  time this debounce function is called again before the function is called.
 *
 *  @param    function    func    Function that will ultimately be executed.
 *  @param    integer     delay   The minimum number of milliseconds that have
 *                                too pass before the function is called.
 *  @returns  function
 */
const debounce = (func, delay) => {
  // Set a timer.
  let timer; // Return the debounced function.

  return function () {
    // Keep track of the context and the arguments that should be passed to the
    // function when it is executed.
    const context = this;
    const args = arguments; // Create a function that executes once the timer runs out.

    const later = () => {
      // Reset the timer.
      timer = null; // Execute the function.

      func.apply(context, args);
    }; // Reset the delay on the timer the debouncing function is called.


    clearTimeout(timer);
    timer = setTimeout(later, delay);
  };
}; // Export the debounce function.


export { debounce };