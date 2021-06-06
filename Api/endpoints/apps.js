// Import dependencies.
const errorResponse = require("../tools/errorResponse");

/**
 *  This function acts as an API endpoint for acts involving all apps.
 *  @param    {EventEmitter}  app       The express application object.
 *  @param    {string}        path      The path to this endpoint. All routes
 *                                      that are processed here should start
 *                                      with this path.
 */
module.exports = function(app, path) {

  /**
   *  This is the endpoint to get access to all apps that a user created.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      authenticated
   */
  app.get(path, async (request, response) => {

    // This is only available to an authenticated user.
    // if (!request.context.authenticated) return errorResponse(response, 401, "Request not allowed.");

    // The database might throw an error.
    try {

      // Get a list of all apps for this user.
      const apps = await request.context.models.App.find({
        user: request.context.user
      });

      // Send back the entire list with all their information.
      return response.send(apps);

     // Listen for any errors that the database might throw.
     } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });
}