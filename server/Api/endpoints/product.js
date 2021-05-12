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
   *
   *  Authentication level required:
   *      authenticated
   */
  app.post(path, async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return response
      .status(500)
      .json({
        error: 'Request not allowed.',
      });

    // Get a list of all products for this user.
    const products = await request.context.models.Product.find({
      model:  request.body.model,
      user:   request.context.user,
    });

    // If a product with this name already exists for this model, we should
    // throw an error.
    if (products.find(product => product.name == request.body.name)) return response
      .status(400)
      .json({
        error: 'A product with this name already exists.',
      });

    // Now we can add the new product to the database.
    const created = await request.context.models.Product.create(Object.assign(request.body, {
      user: request.context.user
    }));

    // Confirm that the request was successfully processed.
    return response.send(!!created);
  });

  /**
   *  This is the endpoint to edit an existing product.
   *
   *  Authentication level required:
   *      authenticated
   */
  app.put(path + '/:productId', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return response
      .status(500)
      .json({
        error: 'Request not allowed.',
      });

    // Get a list of all products for this user.
    const products = await request.context.models.Product.find({
      model: request.body.model,
      user: request.context.user,
    });

    // See if a product with this name already exists. If it is not the product
    // that we're currently editing, we should throw an error.
    const sameName = products.find(product => product.name == request.body.name);
    if (sameName && sameName._id != request.params.productId) return response
      .status(400)
      .json({
        error: 'A product with this name already exists.',
      });

    // Now we can update the product.
    const modified = await request.context.models.Product.updateOne({
      _id:  request.params.productId,
      user: request.context.user
    }, request.body);

    // Check if the product was successfully modified.
    if (modified.nModified == 0) return response
      .status(404)
      .json({
        error: 'Product could not be found.',
      });

    // Confirm that the request was successfully processed.
    return response.send(modified.nModified > 0);
  });

  /**
   *  This is the endpoint to get access to all products that a user created.
   *
   *  Authentication level required:
   *      authenticated
   */
  app.get(path + '/all', async (request, response) => {

    // // This is only available to an authenticated user.
    // if (!request.context.authenticated) return response
    //   .status(500)
    //   .json({
    //     error: 'Request not allowed.',
    //   });

    // Get a list of all products for this user.
    const products = await request.context.models.Product.find({
      // user: request.context.user
    });

    // Send back the entire list with all their information.
    return response.send(products);
  });

  /**
   *  This is the endpoint to get access to one single product.
   *
   *  Authentication level required:
   *      none
   */
  app.get(path + '/:productId', async (request, response) => {

    // Get the requested product.
    const product = await request.context.models.Product.findOne({
      _id: request.params.productId
    });

    // Check if the product exists.
    if (!product) return response
      .status(404)
      .json({
        error: 'Product could not be found.',
      });

    // Send back the entire list with all their information.
    return response.send(product);
  });

  /**
   *  This is the endpoint to delete one single product.
   *
   *  Authentication level required:
   *      authenticated
   */
  app.delete(path + '/:productId', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return response
      .status(500)
      .json({
        error: 'Request not allowed.',
      });

    // Remove the requested product. Make sure we never remove anything by
    // another user.
    const modified = await request.context.models.Product.remove({
      _id:  request.params.productId,
      user: request.context.user

    // Make sure we don't accidentally remove more than one product.
    }, { justOne: true });

    // Check if the product was successfully deleted.
    if (modified.deletedCount == 0) return response
      .status(404)
      .json({
        error: 'Product could not be found.',
      });

    // Confirm that the request was successfully processed.
    return response.send(modified.deletedCount > 0);
  });
}