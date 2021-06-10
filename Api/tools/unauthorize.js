
// Import dependencies.
require('dotenv').config();

/**
 *  Helper function that remove the authorization for the receiver of the next
 *  request.
 *  @param    {ServerResponse}  response  The server response with which to
 *                                        authorize the user.
 *  @returns  {ServerResponse}
 */
module.exports = unauthorize = response => {

  // Set the maximum age of a token.
  const maxAge = 86400;

  // Remove the JWT token cookie. It is important that we provide the exact
  // same options when setting the cookie or browsers will not remove it.
  response.clearCookie("httpToken", {

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

  // Also clear the convenience active session cookie.
  response.clearCookie("xsrfToken", {

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