/**
 *  This function acts as an API endpoint for actings involving users.
 *  @param    {EventEmitter}  app       The express application object.
 *  @param    {string}        path      The path to this endpoint. All routes
 *                                      that are processed here should start
 *                                      with this path.
 */
module.exports = function(app, path) {

  /**
   *  This is the endpoint for the login procedure to supply information about
   *  a single user.
   *
   *  Authentication level required:
   *      none
   */
  app.get(path, async (request, response) => {

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

    // Get the user for this email addresss.
    const user = await request.context.models.User.findOne({
      email: request.body.email,
    });

    /**
     *  Helper function for throwing an incorrect password error.
     *  @returns  {ServerResponse}
     */
    const passwordIncorrect = () => response
      .status(401)
      .setHeader('WWW-Authetnicate', 'Basic')
      .json({
        error: 'This password is incorrect.',
      });

    // If we couldn't find the user, we want to throw an error. We don't want to
    // give away any information about what email address is in our database, so
    // we tell the user that the password is incorrect for this email address.
    if (!user) return passwordIncorrect();

    // Check if the provided password matches the hash that is stored in the
    // database.
    user.checkPassword(request.body.password, (error, isMatch) => {

      // Throw a generic error if an error occurred while checking the password.
      if (error) return response
        .status(400)
        .json({
          error: 'Error occurred: could not login.',
        });

      // Throw the incorrect password error if the password does not match the
      // hash.
      if (!isMatch) return passwordIncorrect();

      // Send back the user's ID and token for confirmation if login was
      // successful.
      return response.send({
        id: user._id,
        token: 'x',
      });
    })
  });

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
      email: request.body.email,
      password: request.body.password,
    });

    // Send back the new user's ID for confirmation.
    return response.send(newUser._id);
  });
}