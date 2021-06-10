/**
 *  This function acts as an API endpoint for logging out.
 *  @param    {EventEmitter}  app       The express application object.
 *  @param    {string}        path      The path to this endpoint. All routes
 *                                      that are processed here should start
 *                                      with this path.
 */
module.exports = function(app, path) {

  /**
   *  This is the endpoint for the logout procedure to remove the JWT.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      none
   */
  app.get(path, async (request, response) => {

    // Remove the JWT token cookie. It is important that we provide the exact
    // same options when setting the cookie or browsers will not remove it.
    response.clearCookie("token", {

      // Let this cookie expire when the token does, in 24 hours.
      maxAge:     86400000,

      // Make sure that client-side JavaScript cannot access this cookie.
      httpOnly:   true,

      // Force HTTPS when used in a production environment.
      secure:     process.env.NODE_ENV == 'production',

      // We should only send this cookie when requested on a website with
      // the same top-level domain.
      sameSite:   'Strict',
    });

    // Also clear the convenience active session cookie.
    response.clearCookie("activeSession", {

      // Let this cookie expire in 24 hours, just like the token.
      maxAge:     86400000,

      // Make sure that client-side JavaScript can access this cookie.
      httpOnly:   false,

      // Force HTTPS when used in a production environment.
      secure:     process.env.NODE_ENV == 'production',

      // We should only send this cookie when requested on a website with
      // the same top-level domain.
      sameSite:   'Strict',
    });

    // Indicate success always.
    return response.send(true);
  });
}