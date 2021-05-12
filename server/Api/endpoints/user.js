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
   *
   *  Authentication level required:
   *      none
   */
  app.post(path, async (request, response) => {

    // Check that we have an email address to login.
    if (!request.body.email) return response
      .status(400)
      .json({
        error: 'An email address is required.',
      });

    // Check that we have a password to login.
    if (!request.body.password) return response
      .status(400)
      .json({
        error: 'A password is required.',
      });

    // Second, check to see if a user with this email address already exists.
    const exists = await request.context.models.User.findOne({
      email: request.body.email,
    });

    // If this user already exists, we should return an error to explain why the
    // user could not be registered.
    if (exists) return response
      .status(409)
      .json({
        error: 'This email address is already in use.',
      });

    // Now we can add the new user to the database.
    const newUser = await request.context.models.User.create({
      email:    request.body.email,
      password: request.body.password,
    });

    // Confirm that the request was successfully processed.
    return response.send(true);
  });

  /**
   *  This is the endpoint to supply information about all users.
   *  @TODO   Remove this endpoint since it is a security leak, but useful while
   *          testing.
   *
   *  Authentication level required:
   *      none
   */
  app.get(path + '/all', async (request, response) => {

    // Get a list of all users.
    const users = await request.context.models.User.find();

    // Send back the entire list with all their information.
    return response.send(users);
  });
}