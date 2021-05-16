// Import dependencies.
const errorResponse = require("../errorResponse");

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

      // Try to add the new user to the database.
      const user = await request.context.models.User.create({
        email:    request.body.email,
        password: request.body.password,
      });

      // Check if adding the user worked.
      if (!user) errorResponse(response, 500, "Could not register new user.");

      // Confirm that the request was successfully processed.
      return response.send(true);

    // Listen for any errors that the database might throw.
    } catch (error) {

    // Return the error to the client.
    return errorResponse(response, 400, error);
   }
 });

  // /**
  //  *  This is the endpoint to supply information about all users.
  //  *  @TODO   Remove this endpoint since it is a security leak, but useful while
  //  *          testing.
  //  *
  //  *  Authentication level required:
  //  *      none
  //  */
  // app.get(path + '/all', async (request, response) => {

  //   // Get a list of all users.
  //   const users = await request.context.models.User.find();

  //   // Send back the entire list with all their information.
  //   return response.send(users);
  // });
}