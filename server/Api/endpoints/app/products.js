/**
 *  This function acts as an API endpoint for products tied to a specific app.
 *  @param    {EventEmitter}  app       The express application object.
 *  @param    {string}        path      The path to this endpoint. All routes
 *                                      that are processed here should start
 *                                      with this path.
 */
module.exports = function(app, path) {

  /**
   *  This is the endpoint to get access to all products that a user created for
   *  one specific app.
   *
   *  Authentication level required:
   *      authenticated
   */
  app.get(path + '/:appId' , async (request, response) => {

    console.log(request.params.appId);

    // We don't know if an app id or a path was provided, but we need the app
    // ID. Luckily, we can uniquely identify an app by either. From that, we can
    // then extract the ID.
    const app = await request.context.models.App.findByIdOrPath(request.params.appId);

    // If we couldn't find the app at all, return an error.
    if (!app) return response
      .status(404)
      .json({
        error: 'App could not be found.',
      });

    // Get a list of all models for this app.
    const models = await request.context.models.Model.find({
      app: app._id
    });

    // We want to build a single array of products.
    const allProducts = [];

    // Gather the products for all models.
    for (const model of models) {

      // Get a list of all products for each model.
      const products = await request.context.models.Product.find({
        model: model._id
      });

      // Loop through all products.
      for (const product of products) {

        // Add the name of the model to each product.
        allProducts.push(Object.assign({}, product._doc, { modelName: model.name }));
      }
    }

    // Send back the entire list.
    return response.send(allProducts);
  });
}