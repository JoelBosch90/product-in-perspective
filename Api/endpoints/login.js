// Import dependencies.
const errorResponse = require("../tools/errorResponse");

/**
 *  This function acts as an API endpoint for actings involving users.
 *  @param    {EventEmitter}  app       The express application object.
 *  @param    {string}        path      The path to this endpoint. All routes
 *                                      that are processed here should start
 *                                      with this path.
 */
module.exports = function(app, path) {

  /**
   *  This is the endpoint for the login procedure to get the JWT.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      none
   */
  app.post(path, async (request, response) => {

    // The database might throw an error.
    try {

      // Get the user for this email addresss.
      const user = await request.context.models.User.findOne({
        email: request.body.email,
      });

      // If we couldn't find the user, we want to throw an error. We don't want
      // to give away any information about what email address is in our
      // database if we don't have to, so we tell the user that the password is
      // incorrect for this email address.
      if (!user) throw new Error("Password incorrect.");

      // Check if the provided password matches the hash that is stored in the
      // database.
      const isMatch = await user.checkPassword(request.body.password)
        .catch(error => { throw new Error("Could not authenticate."); });

      // Throw the incorrect password error if the password does not match
      // the hash.
      if (!isMatch) throw new Error("Password incorrect.");

      // Add the JSON web token as an HTTP only cookie for authentication.
      response.cookie('token', user.createToken(), {

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

      // We send a second cookie to the client.
      response.cookie('activeSession', true, {

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

      // Send back the user's ID and token for confirmation if login was
      // successful.
      return response.send({
        id:     user._id,
        token:  user.createToken(),
      });

     // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });
}