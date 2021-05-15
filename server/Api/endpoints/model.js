/**
 *  This function acts as an API endpoint for acts involving models.
 *  @param    {EventEmitter}  app       The express application object.
 *  @param    {string}        path      The path to this endpoint. All routes
 *                                      that are processed here should start
 *                                      with this path.
 */
module.exports = function(app, path) {

  /**
   *  This is the endpoint to create a new model.
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

    // Get a list of all models for this user and the selected app.
    const models = await request.context.models.Model.find({
      app:  request.body.app,
      user: request.context.user,
    });

    // If a model with this name already exists for this app, we should throw an
    // error.
    if (models.find(model => model.name == request.body.name)) return response
      .status(400)
      .json({
        error: 'A model with this name already exists.',
      });

    // Now we can add the new model to the database.
    const created = await request.context.models.Model.create(Object.assign(request.body, {
      user: request.context.user
    }));

    // Confirm that the request was successfully processed.
    return response.send(!!created);
  });

  /**
   *  This is the endpoint to edit an existing model.
   *
   *  Authentication level required:
   *      authenticated
   */
  app.put(path + '/:modelId', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return response
      .status(500)
      .json({
        error: 'Request not allowed.',
      });

    // Get a list of all models for this user and the selected app.
    const models = await request.context.models.Model.find({
      app:  request.body.app,
      user: request.context.user
    });

    // See if a model with this name already exists. If it is not the model that
    // we're currently editing, we should throw an error.
    const sameName = models.find(model => model.name == request.body.name);
    if (sameName && sameName._id != request.params.modelId) return response
      .status(400)
      .json({
        error: 'A model with this name already exists.',
      });

    // Now we can update the model.
    const modified = await request.context.models.Model.updateOne({
      _id:  request.params.modelId,
      user: request.context.user
    }, request.body);

    // Check if the model was successfully modified.
    if (modified.nModified == 0) return response
      .status(404)
      .json({
        error: 'Model could not be found.',
      });

    // Confirm that the request was successfully processed.
    return response.send(modified.nModified > 0);
  });

  /**
   *  This is the endpoint to get access to all models that a user created.
   *
   *  Authentication level required:
   *      authenticated
   */
  app.get(path + '/all', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return response
      .status(500)
      .json({
        error: 'Request not allowed.',
      });

    // Get a list of all models for this user.
    const models = await request.context.models.Model.find({
      user: request.context.user
    });

    // Send back the entire list with all their information.
    return response.send(models);
  });

  /**
   *  This is the endpoint to get access to one single model.
   *
   *  Authentication level required:
   *      none
   */
  app.get(path + '/:modelId', async (request, response) => {

    // Get the requested model.
    const model = await request.context.models.Model.findOne({
      _id: request.params.modelId
    });

    // Check if the model exists.
    if (!model) return response
      .status(404)
      .json({
        error: 'Model could not be found.',
      });

    // Send back the entire list with all their information.
    return response.send(model);
  });

  /**
   *  This is the endpoint to delete one single model.
   *
   *  Authentication level required:
   *      authenticated
   */
  app.delete(path + '/:modelId', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return response
      .status(500)
      .json({
        error: 'Request not allowed.',
      });

    // Remove the requested model. Make sure we never remove anything by another
    // user.
    const modified = await request.context.models.Model.remove({
      _id:  request.params.modelId,
      user: request.context.user

    // Make sure we don't accidentally remove more than one model.
    }, { justOne: true });

    // Check if the model was successfully deleted.
    if (modified.deletedCount == 0) return response
      .status(404)
      .json({
        error: 'Model could not be found.',
      });

    // Confirm that the request was successfully processed.
    return response.send(modified.deletedCount > 0);
  });
}