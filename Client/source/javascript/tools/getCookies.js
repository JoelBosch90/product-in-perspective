/**
 *  Helper function to get access to the local cookies.
 *  @returns  {Object}
 */
 const getCookies = () => {
  // Get all the cookies as an object.
  return document.cookie.split('; ').reduce((accumulator, current) => {

    // Split them by the equals operator.
    const [key, value] = current.split('=');

    // Assign the key value combination for each cookie to the object.
    accumulator[key] = value;

    // Return the object to keep checking.
    return accumulator;
  }, {});
}

// Export the getCookies function.
export { getCookies };