// Import dependencies
const unauthorize = require("../tools/unauthorize");

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

    // Remove authorization.
    unauthorize(response);

    // Indicate success always.
    return response.send(true);
  });
}