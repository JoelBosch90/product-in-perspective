// Import dependencies.
const errorResponse = require("../errorResponse");

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

    // Check if the model could be a valid GLTF model.
    if (!request.body.model.startsWith("data:application/octet-stream")) {

      // If not, return an error.
      return errorResponse(response, 400, "Not a valid glTF model.");
    }

    // The database might throw an error.
    try {

      // We want to store any model that was provided and save its location in
      // the database.
      request.body.file = await request.context.storage.store(request.body.model, 'gltf');

      // Now we can add the new model to the database.
      const model = await request.context.models.Model.create(Object.assign(request.body, {
        user: request.context.user
      }));

      // Check if the model was indeed created.
      if (!model) errorResponse(response, 500, "Model could not be created.");

      // Confirm that the request was successfully processed.
      return response.send(true);

    // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });

  /**
   *  This is the endpoint to edit an existing model.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      authenticated
   */
  app.put(path + '/:modelId', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return errorResponse(response, 401, "Request not allowed.");

    // If a model is provided, check if it could be a valid GLTF model.
    if (request.body.model && !request.body.model.startsWith("data:application/octet-stream")) {

      // If not, return an error.
      return errorResponse(response, 400, "Not a valid glTF model.");
    }

    // The database might throw an error.
    try {

      // Get the storage object.
      const storage = request.context.storage;

      // We want to store any model that was provided and save its location in
      // the database.
      request.body.file = await storage.store(request.body.model, 'gltf');

      // Get the model.
      const model = await request.context.models.Model.findOne({
        _id:  request.params.modelId,
        user: request.context.user
      });

      // If we have a new file to store, remove the previous one from object
      // storage.
      if (request.body.file) storage.delete(model._doc.file);

      // Now we can update the model.
      const modified = await request.context.models.Model.updateOne({
        _id:  request.params.modelId,
        user: request.context.user
      }, request.body);

      // Check if the model was indeed modified.
      if (modified.nModified <= 0) return errorResponse(response, 500, "Could not edit model.");

      // Confirm that the request was successfully processed.
      return response.send(true);

    // Listen for any errors that the database might throw.
    } catch (error) {

      console.log(error);

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });

  /**
   *  This is the endpoint to get access to one single model.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      none
   */
  app.get(path + '/:modelId', async (request, response) => {

    // The database might throw an error.
    try {

      // Get the requested model.
      const model = await request.context.models.Model.findOne({
        _id: request.params.modelId
      });

      // Check if we actually have the model.
      if (!model) return errorResponse(response, 404, "Could not find model.");

      // Get the URL to the file.
      const url = await request.context.storage.retrieveUrl(model.file);

      // Send back the model with the URL to the file.
      return response.send(Object.assign({}, model._doc, { url }));

    // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });

  /**
   *  This is the endpoint to delete one single model.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      authenticated
   */
  app.delete(path + '/:modelId', async (request, response) => {

    // This is only available to an authenticated user.
    if (!request.context.authenticated) return errorResponse(response, 401, "Request not allowed.");

    // The database might throw an error.
    try {

      // Get the model.
      const model = await request.context.models.Model.findOne({
        _id:  request.params.modelId,
        user: request.context.user
      });

      // Make sure we remove the object from our object storage.
      request.context.storage.delete(model._doc.file);

      // Remove the requested model. Make sure we never remove anything by another
      // user.
      const modified = await request.context.models.Model.remove({
        _id:  request.params.modelId,
        user: request.context.user

      // Make sure we don't accidentally remove more than one model.
      }, { justOne: true });

      // Check if the model was successfully deleted.
      if (modified.deletedCount <= 0) return errorResponse(response, 404, "Could not find model.");

      // Confirm that the request was successfully processed.
      return response.send(true);

    // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });
}