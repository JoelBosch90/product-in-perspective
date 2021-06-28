// Import dependencies.
const errorResponse = require("../tools/errorResponse");
const authorize = require("../tools/authorize");
const jwt = require("jsonwebtoken");
require('dotenv').config();

/**
 *  This function acts as an API endpoint for logging in.
 *  @param    {EventEmitter}  app       The express application object.
 *  @param    {string}        path      The path to this endpoint. All routes
 *                                      that are processed here should start
 *                                      with this path.
 */
module.exports = function(app, path) {

  /**
   *  This is the endpoint for the login procedure to get the JWT.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      none
   */
  app.post(path, async (request, response) => {

    // The database might throw an error.
    try {

      // Get the user for this email addresss.
      const user = await request.context.models.User.findOne({
        email: request.body.email,
      });

      // If we couldn't find the user, we want to throw an error.
      if (!user) throw new Error("This user does not exist.");

      console.log(user);

      // We want each user to confirm their email address first.
      if (!user.verified) throw new Error("Please confirm your email address by logging in via email link first.");

      // Check if the provided password matches the hash that is stored in the
      // database.
      const isMatch = await user.checkPassword(request.body.password)
        .catch(error => { throw new Error("Could not authenticate."); });

      // Throw the incorrect password error if the password does not match
      // the hash.
      if (!isMatch) throw new Error("Password incorrect.");

      // Authorize the user with this response.response
      authorize(user, response);

      // Send back the user's ID and token for confirmation if login was
      // successful.
      return response.send({
        id:     user._id,
      });

     // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });

  /**
   *  This is the endpoint to send a login link via email.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      none
   */
  app.post(path + '/sendLink', async (request, response) => {

    // The database could throw an error.
    try {

      // Get the user for this email addresss.
      const user = await request.context.models.User.findOne({
        email: request.body.email,
      });

      // If we couldn't find the user, we want to throw an error.
      if (!user) throw new Error("This user does not exist.");

      // Send the email verification email.
      await sendVerificationMail(user);

      // Let the user know that the email was sent.
      response.send(true);

     // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return errorResponse(response, 400, error);
    }
  });

  /**
   *  This is the endpoint to send a login link via email.
   *  @param    {IncomingMessage} request   Information object about the
   *                                        request.
   *  @param    {ServerResponse}  response  Object to construct the response
   *                                        message.
   *  @returns  {ServerResponse}
   *
   *  Authentication level required:
   *      none
   */
  app.get(path + '/link/:token', async (request, response) => {

    // The database could throw an error.
    try {

      // This is an attempt to log in. We should end the previous login session.
      unauthorize(response);

      // Verify the JSON web token.
      const details = await jwt.verify(request.params.token, process.env.TOKEN_SECRET, (error, decoded) => {

        // Turn this into a neat promise for cleaner handling.
        return new Promise((resolve, reject) => {

          // If verification fails, we will remove the current authorization
          // tokens.
          if (error) return reject(error);

          // Simply resolve to the content of the JWT.
          resolve(decoded);
        });
      });

      // Get the user from the token details.
      const user = await request.context.models.User.findOneAndUpdate({
        _id: details.id,
      }, {

        // Update the date at which the user was last verified.
        verified: Date.now(),
      });

      // If we couldn't find the user, we want to throw an error.
      if (!user) throw new Error("This user does not exist.");

      // Issue new authorization cookies to let the user login immediately.
      authorize(user, response);

      // Send the user to the apps overview.
      return response.redirect(`${process.env.EXTERNAL_URL}/admin/apps`);

     // Listen for any errors that the database might throw.
    } catch (error) {

      // Return the error to the client.
      return response.redirect(`${process.env.EXTERNAL_URL}/invalid-link`);
    }
  });
}