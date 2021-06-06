// Import dependencies.
const errorResponse = require("../tools/errorResponse");

/**
 *  This function acts as an API endpoint for acts involving all models.
 *  @param    {EventEmitter}  app       The express application object.
 *  @param    {string}        path      The path to this endpoint. All routes
 *                                      that are processed here should start
 *                                      with this path.
 */
module.exports = function(app, path) {

  /**
   *  This is the endpoint to get access to all models that a user created.
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
    if (!request.context.authenticated) return errorResponse(response, 401, "Request not allowed.");

    // The database might throw an error.
    try {

      // Get a list of all models for this user.
      const models = await request.context.models.Model.find({
        user: request.context.user
      });

      // Check if we did indeed find the models.
      if (!models) return  errorResponse(response, 404, "Models could not be found.");

      // Send back the entire list with all their information.
      return response.send(models);

    // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });
}