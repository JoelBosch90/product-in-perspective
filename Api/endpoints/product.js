// Import dependencies.
const errorResponse = require("../tools/errorResponse");

/**
 *  This function acts as an API endpoint for acts involving products.
 *  @param    {EventEmitter}  app       The express application object.
 *  @param    {string}        path      The path to this endpoint. All routes
 *                                      that are processed here should start
 *                                      with this path.
 */
 module.exports = function(app, path) {

  /**
   *  This is the endpoint to create a new product.
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

    // The database might throw an error.
    try {

      // Now we can add the new product to the database.
      const product = await request.context.models.Product.create(Object.assign(request.body, {
        user: request.context.user
      }));

      // Check if we did indeed create the product.
      if (!product) return  errorResponse(response, 404, "Product could not be created.");

      // Send back the product.
      return response.send(product);

    // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });

  /**
   *  This is the endpoint to edit an existing product.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      authenticated
   */
  app.put(path + '/:productId', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return errorResponse(response, 401, "Request not allowed.");

    // The database might throw an error.
    try {

      // Now we can update the product.
      const modified = await request.context.models.Product.updateOne({
        _id:  request.params.productId,
        user: request.context.user
      }, request.body);

      // Check if we did indeed find the product.
      if (modified.nModified <= 0) return  errorResponse(response, 404, "Product could not be found.");

      // Confirm success.
      return response.send(true);

    // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });

  /**
   *  This is the endpoint to get access to one single product.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      none
   */
  app.get(path + '/:productId', async (request, response) => {

    // The database might throw an error.
    try {

      // Get the requested product.
      const product = await request.context.models.Product.findOne({
        _id: request.params.productId

      // Provide the information for all models as well.
      }).populate('models');

      // Check if we did indeed find the product.
      if (!product) return  errorResponse(response, 404, "Product could not be found.");

      // Return the product.
      return response.send(product);

    // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });

  /**
   *  This is the endpoint to delete one single product.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      authenticated
   */
  app.delete(path + '/:productId', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return errorResponse(response, 401, "Request not allowed.");

    // The database might throw an error.
    try {

      // Remove the requested product. Make sure we never remove anything by
      // another user.
      const modified = await request.context.models.Product.remove({
        _id:  request.params.productId,
        user: request.context.user

      // Make sure we don't accidentally remove more than one product.
      }, { justOne: true });

      // Check if we did indeed delete the product.
      if (modified.deletedCount <= 0) return  errorResponse(response, 404, "Product could not be found.");

      // Confirm success.
      return response.send(true);

    // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });
}