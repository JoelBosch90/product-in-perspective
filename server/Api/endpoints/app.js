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

    // Get a list of all apps for this user.
    const apps = await request.context.models.App.find({
      user: request.context.user
    });

    // If an app with this name already exists for this user, we should throw an
    // error.
    if (apps.find(app => app.name == request.body.name)) return response
      .status(400)
      .json({
        error: 'An app with this name already exists.',
      });

    // Now we can add the new app to the database.
    const created = await request.context.models.App.create(Object.assign(request.body, {
      user: request.context.user
    }));

    // Confirm that the request was successfully processed.
    return response.send(!!created);
  });

  /**
   *  This is the endpoint to edit an existing app.
   *
   *  Authentication level required:
   *      authenticated
   */
  app.put(path + '/:appId', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return response
      .status(500)
      .json({
        error: 'Request not allowed.',
      });

    // Get a list of all apps for this user.
    const apps = await request.context.models.App.find({
      user: request.context.user
    });

    // See if an app with this name already exists. If it is not the app that
    // we're currently editing, we should throw an error.
    const sameName = apps.find(app => app.name == request.body.name);
    if (sameName && sameName._id != request.params.appId) return response
      .status(400)
      .json({
        error: 'An app with this name already exists.',
      });

    // Now we can update the app.
    const modified = await request.context.models.App.updateOne({
      _id:  request.params.appId,
      user: request.context.user
    }, request.body);

    // Check if the app was successfully modified.
    if (modified.nModified == 0) return response
      .status(404)
      .json({
        error: 'App could not be found.',
      });

    // Confirm that the request was successfully processed.
    return response.send(modified.nModified > 0);
  });

  /**
   *  This is the endpoint to get access to all apps that a user created.
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

    // Get a list of all apps for this user.
    const apps = await request.context.models.App.find({
      user: request.context.user
    });

    // Send back the entire list with all their information.
    return response.send(apps);
  });

  /**
   *  This is the endpoint to get access to one single app.
   *
   *  Authentication level required:
   *      none
   */
  app.get(path + '/:appId', async (request, response) => {

    // We don't know if an app id or a path was provided, but we should be able
    // to find the app with either.
    const app = await request.context.models.App.findByIdOrPath(request.params.appId);

    // If we couldn't find the app at all, return an error.
    if (!app) return response
      .status(404)
      .json({
        error: 'App could not be found.',
      });

    // Send back the app we found.
    return response.send(app);
  });

  /**
   *  This is the endpoint to delete one single app.
   *
   *  Authentication level required:
   *      authenticated
   */
  app.delete(path + '/:appId', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return response
      .status(500)
      .json({
        error: 'Request not allowed.',
      });

    // Remove the requested app. Make sure we never remove anything by another
    // user.
    const modified = await request.context.models.App.remove({
      _id:  request.params.appId,
      user: request.context.user

    // Make sure we don't accidentally remove more than one app.
    }, { justOne: true });

    // Check if the app was successfully deleted.
    if (modified.deletedCount == 0) return response
      .status(404)
      .json({
        error: 'App could not be found.',
      });

    // Confirm that the request was successfully processed.
    return response.send(modified.deletedCount > 0);
  });
}