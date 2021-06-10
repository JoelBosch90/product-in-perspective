// Import dependencies.
const errorResponse = require("../tools/errorResponse");
const authorize = require("../tools/authorize");

/**
 *  This function acts as an API endpoint for logging in.
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

      // Authorize the user with this response.response
      authorize(user, response);

      // Send back the user's ID and token for confirmation if login was
      // successful.
      return response.send({
        id:     user._id,
      });

     // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });
}