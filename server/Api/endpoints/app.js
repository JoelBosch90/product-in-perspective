// Import dependencies.
const errorResponse = require("../errorResponse");

/**
 *  This function acts as an API endpoint for acts involving apps.
 *  @param    {EventEmitter}  app       The express application object.
 *  @param    {string}        path      The path to this endpoint. All routes
 *                                      that are processed here should start
 *                                      with this path.
 */
module.exports = function(app, path) {

  /**
   *  This is the endpoint to create a new app.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      authenticated
   */
  app.post(path, async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return errorResponse(response, 401, "Request not allowed.");

    // The database might throw an error in case of a conflict.
    try {

      // Create the new app for this user.
      await request.context.models.App.create(Object.assign(request.body, {
        user: request.context.user
      }));

      // Confirm that the request was successfully processed.
      return response.send(true);

    // Listen for any conflict errors that the database might throw.
    } catch (error) {

      // Return the conflict error to the client.
      return errorResponse(response, 400, error);
    }
  });

  /**
   *  This is the endpoint to edit an existing app.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      authenticated
   */
  app.put(path + '/:appId', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return errorResponse(response, 401, "Request not allowed.");

    // The database might throw an error in case of a conflict.
    try {

      // Try to update the app. Make sure we're only ever updating one and never
      // another user's app.
      const modified = await request.context.models.App.updateOne({
        _id:  request.params.appId,
        user: request.context.user
      }, request.body);

      // Return an error if we could not find the app.
      if (modified.nModified <= 0) return errorResponse(response, 404, "App not found.");

      // Confirm that the request was successfully processed.
      return response.send(true);

    // Listen for any conflict errors that the database might throw.
    } catch (error) {

      // Return the conflict error to the client.
      return errorResponse(response, 400, error);
    }
  });

  /**
   *  This is the endpoint to get access to one single app.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      none
   */
  app.get(path + '/:appId', async (request, response) => {

    // The database might throw an error if it cannot find the app.
    try {

      // Try to to find the app by id or by path.
      const app = await request.context.models.App.findByIdOrPath(request.params.appId)

      // Return an error if we could not find the app.
      if (!app) return errorResponse(response, 404, "App not found.");

      return response.send(app);

    // Listen for any errors that the database might throw if we can't find the
    // app.
    } catch (error) {

      // Return the error if the app could not be found.
      return errorResponse(response, 400, error);
    }
  });

  /**
   *  This is the endpoint to delete one single app.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      authenticated
   */
  app.delete(path + '/:appId', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return errorResponse(response, 401, "Request not allowed.");

    // The database might throw an error.
    try {

      // Try to delete the app. Make sure we're only ever updating one and never
      // another user's app.
      const modified = await request.context.models.App.remove({
        _id:  request.params.appId,
        user: request.context.user

      // Make sure we don't accidentally remove more than one app.
      }, { justOne: true });

      // Return an error if we could not find the app.
      if (modified.deletedCount <= 0) return errorResponse(response, 404, "App not found.");

      // Confirm that the request was successfully processed.
      return response.send(true);

    // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });

  /**
   *  This is the endpoint to get access to all products that a user created for
   *  one specific app.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      authenticated
   */
  app.get(path + '/:appId/products' , async (request, response) => {

    // The database might throw an error.
    try {

      // We don't know if an app id or a path was provided, but we need the app
      // ID. Luckily, we can uniquely identify an app by either. From that, we can
      // then extract the ID.
      const app = await request.context.models.App.findByIdOrPath(request.params.appId);

      // Return an error if we could not find the app.
      if (!app) return errorResponse(response, 404, "App not found.");

      // Get a list of all products for this app.
      const products = await request.context.models.Product.find({ app: app._id });

      // Send back the entire list.
      return response.send(products);

    // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });
}