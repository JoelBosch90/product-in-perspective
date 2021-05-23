// Import dependencies.
const errorResponse = require("../tools/errorResponse");

/**
 *  This function acts as an API endpoint for acts involving all products.
 *  @param    {EventEmitter}  app       The express application object.
 *  @param    {string}        path      The path to this endpoint. All routes
 *                                      that are processed here should start
 *                                      with this path.
 */
 module.exports = function(app, path) {

  /**
   *  This is the endpoint to get access to all products that a user created.
   *
   *  Authentication level required:
   *      authenticated
   */
  app.get(path, async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return errorResponse(response, 401, "Request not allowed.");

    // The database might throw an error.
    try {

      // Get a list of all products for this user.
      const products = await request.context.models.Product.find({
        user: request.context.user
      });

      // Check if we did indeed find the products.
      if (!products) return  errorResponse(response, 404, "Products could not be found.");

      // Send back the products.
      return response.send(products);

    // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });
}