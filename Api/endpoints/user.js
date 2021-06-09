// Import dependencies.
const errorResponse = require("../tools/errorResponse");

/**
 *  This function acts as an API endpoint for acts involving users.
 *  @param    {EventEmitter}  app       The express application object.
 *  @param    {string}        path      The path to this endpoint. All routes
 *                                      that are processed here should start
 *                                      with this path.
 */
module.exports = function(app, path) {

  /**
   *  This is the endpoint to register a new user.
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

      // Check that the user didn't misstype the password.
      if (request.body.password != request.body.repeat) throw new Error("Passwords do not match.");

      // Check if a user with this email already exists.
      const existing = await request.context.models.User.findOne({
        email:  request.body.email,
      });

      // If so, throw an error, as emails should be unique.
      if (existing) throw new Error("An account for this email address already exists.");

      // Try to add the new user to the database.
      const user = await request.context.models.User.create({
        email:    request.body.email,
        password: request.body.password,
      });

      // Check if adding the user worked.
      if (!user) throw new Error("Could not register new user.");

      // Confirm that the request was successfully processed.
      return response.send(true);

    // Listen for any errors that the database might throw.
    } catch (error) {

    // Return the error to the client.
    return errorResponse(response, 400, error);
   }
 });
}