// Import dependencies.
const jwt = require("jsonwebtoken");
require('dotenv').config();

/**
 *  Helper function that create a link that allows a specific user to login.
 *  @param    {Object}          user      The user to authorize.
 *  @returns  {Promise}
 */
module.exports = createLoginLink = user => {

  // Let login tokens expire in 1 hour.
  const maxAge = 3600;

  // Create a new verificiation token.
  const token = jwt.sign({

    // Add the user's ID so that we can use the JWT to identify the user.
    id:         user._id,

    // Let's add the type for our own bookkeeping.
    type:       'loginToken',

  // Create the JWT with the environment token secret.
  }, process.env.TOKEN_SECRET, {

    // Set the maximum age of a vertification token.
    expiresIn:  maxAge,
  });

  // Use the token to craft the login URL.
  return `${process.env.EXTERNAL_URL}/api/login/link/${token}`;
}