
// Import dependencies.
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
require('dotenv').config();

/**
 *  Helper function that authorizes a user. We want to do this in a stateless
 *  fashion to allow for easy scaling of the application. That is why we use
 *  JSON webtokens for authentication. We store these tokens client-side and
 *  demands them with every request for authentication.
 *  Safely storing these tokens client-side is a little tricky, however.
 *  If we store the tokens in localStorage or sessionStorage, they would be
 *  immediately accessible by any JavaScript, including scripts from an XSS
 *  attack.
 *  Instead, we can store the JWT in an HttpOnly cookie that is not accessible
 *  from JavaScript. This is immune from XSS attacks, but opens us up for CSRF
 *  attacks that coax a user into making a malicious request with their cookies.
 *  During a CSRF attack, the hacker cannot actually read the cookies, so if we
 *  send an extra token in a cookie to the client, we can have the client send
 *  this token in the request headers. When we store that same token in the JWT,
 *  then we can check if they match for each request. This makes sure that an
 *  attacker has to achieve both XSS and CSRF to open us up to an attack.
 *  @param    {Object}          user      The user to authorize.
 *  @param    {ServerResponse}  response  The server response with which to
 *                                        authorize the user.
 *  @returns  {ServerResponse}
 */
module.exports = authorize = (user, response) => {

  // Create an XRSF token. This is the token that we want the client to send
  // in the header with each request so that we can check it against the token
  // in the JWT.
  const xsrfToken = crypto.randomBytes(128).toString('hex');

  // Set the maximum age of a token.
  const maxAge = 86400;

  // Create the JSON web token.
  const httpToken = jwt.sign({

    // Add the user's ID so that we can use the JWT to identify the user.
    id:         user._id,

    // Add the XSRF token to the JWT so we can later check it with the XSRF
    // header in the requests.
    xsrf:       xsrfToken,

    // Let's add the type for our own bookkeeping.
    type:       'httpToken',

  // Create the JWT with the environment token secret.
  }, process.env.TOKEN_SECRET, {

    // Let each token expire in 24 hours.
    expiresIn:  maxAge,
  });

  // Add the JSON web token as an HTTP only cookie for authentication.
  response.cookie('httpToken', httpToken, {

    // Let this cookie expire in 24 hours, just like the token. Remember
    // that this is set in milliseconds.
    maxAge:     maxAge * 1000,

    // Make sure that client-side JavaScript cannot access this cookie.
    httpOnly:   true,

    // Force HTTPS when used in a production environment.
    secure:     process.env.NODE_ENV == 'production',

    // We should only send this cookie when requested on a website with
    // the same top-level domain.
    sameSite:   'Strict',
  });

  // We send a second cookie to the client.
  response.cookie('xsrfToken', xsrfToken, {

    // Let this cookie expire in 24 hours, just like the token. Remember
    // that this is set in milliseconds.
    maxAge:     maxAge * 1000,

    // Make sure that client-side JavaScript can access this cookie.
    httpOnly:   false,

    // Force HTTPS when used in a production environment.
    secure:     process.env.NODE_ENV == 'production',

    // We should only send this cookie when requested on a website with
    // the same top-level domain.
    sameSite:   'Strict',
  });
}