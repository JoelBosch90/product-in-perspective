// Load libraries.
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");

// Import dependencies.
const Database = require('./Database.js');
const Storage = require('./Storage.js');

/**
 *  The definition of the Api class component that is used to process all API
 *  requests.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Api {

  /**
   *  Reference to the configuration object.
   *  @var      {object}
   */
  _config = {};

  /**
   *  Reference to the database connection object.
   *  @var      {???}
   */
  _database = null;

  /**
   *  Class constructor.
   *  @param    {object}    config      The configuration object.
   *    @property {object}    api         The API part of the configuration.
   *      @property {string}    host        The API application host.
   *      @property {number}    port        The API application port.
   *    @property {object}    database    The database credentials.
   *      @property {string}    name        The name of the database.
   *      @property {string}    user        The username for connecting to the
   *                                        database.
   *      @property {string}    password    The password for connecting to the
   *                                        database.
   *      @property {string}    secret      The database secret for creating
   *                                        tokens.
   *      @property {string}    host        The URL to connect to the database.
   *      @property {number}    port        The port to connect to the database.
   *    @property {object}    storage     The object storage credentials.
   *      @property {string}    host        The URL for connecting to the object
   *                                        storage.
   *      @property {number}    port        The port for connecting to the
   *                                        object storage.
   *      @property {string}    accessKey   The access key for the storage.
   *      @property {string}    secretKey   The secret key for the storage.
   */
  constructor(config) {

    // Get the express application object.
    const app = express();

    // Store the config for reference.
    this._config = config;

    // We are behind a reverse proxy that we should trust.
    app.set('trust proxy', true);

    // Connect to the database.
    this._connectDatabase(app);

    // Connect to the object storage.
    this._connectStorage(app);

    // Install external middleware.
    this._installMiddelware(app, express);

    // For every request, we want to try processing authentication.
    this._installAuthentication(app);

    // Now we can load all of our API endpoints.
    this._installEndpoints(app);

    // Start listening for incoming requests.
    this._listen(app, config.api.host, config.api.port);
  }

  /**
   *  Private method to connect to the database.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _connectDatabase = app => {

    // Start the new database.
    this._database = new Database(this._config.database);

    /**
     * Install new middleware on the Express app.
     *  @param    {IncomingMessage} request   Information object about the
     *                                        request.
     *  @param    {ServerResponse}  response  Object to construct the response
     *                                        message.
     *  @param    {Function}        next      Executing this callback function
     *                                        will allow for the request to be
     *                                        processed further.
     */
    app.use((request, response, next) => {

      // Create or expand the context for each request.
      request.context = Object.assign({}, request.context, {

        // Add the database models to the context of each request for easy
        // access.
        models: this._database.models(),
      });

      // Show that we're done here and can continue processing the request.
      next();
    });
  }

  /**
   *  Private method to connect to the object storage.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _connectStorage = app => {

    // Start the new object storage to store our models.
    this._storage = new Storage("models", this._config.storage);

    /**
     * Install new middleware on the Express app.
     *  @param    {IncomingMessage} request   Information object about the
     *                                        request.
     *  @param    {ServerResponse}  response  Object to construct the response
     *                                        message.
     *  @param    {Function}        next      Executing this callback function
     *                                        will allow for the request to be
     *                                        processed further.
     */
    app.use((request, response, next) => {

      // Create or expand the context for each request.
      request.context = Object.assign({}, request.context, {

        // Add the storage to the context of each request for easy access.
        storage: this._storage,
      });

      // Show that we're done here and can continue processing the request.
      next();
    });
  }

  /**
   *  Private method to install the middleware we want to use. These are all
   *  modifications on request parameters before handling the call.
   *  @param    {EventEmitter}    app     The express application object.
   *  @param    {Function}        express The express library object.
   */
  _installMiddelware = (app, express) => {

    // Use the CORS library to manage CORS headers for external connections.
    app.use(cors());

    // Express allows for files up to 100kb by default. Big models can easily
    // grow larger than that. Even though these files shouldn't be too large as
    // they need to work well on the web; we still want to allow for larger
    // files.
    const limit = '25mb';

    // We need to get access to the request data in the request's body object.
    // In this API, we want to exclusively use JSON objects to communicate with
    // the client.
    app.use(express.json({ limit }));
    app.use(express.urlencoded({
      limit,

      // We do want to use nested objects.
      extended: true,
    }));

    // We need to be able to set and read cookies.
    app.use(cookieParser());

    // We want to install protection against DDOS attacks.
    app.use(rateLimit({

      // Set a limit per 10 minutes.
      windowMs: 600000,

      // Allow a maxium of 500 requests for a single user.
      max: 500,
    }));
  }

  /**
   *  Private method to install middleware to authenticate each request.
   *  @param    {EventEmitter}    app     The express application object.
   */
   _installAuthentication = app => {

    /**
     * Install new middleware on the Express app.
     *  @param    {IncomingMessage} request   Information object about the
     *                                        request.
     *  @param    {ServerResponse}  response  Object to construct the response
     *                                        message.
     *  @param    {Function}        next      Executing this callback function
     *                                        will allow for the request to be
     *                                        processed further.
     */
    app.use(async (request, response, next) => {

      // Check if we have an access token.
      const token = request.cookies['token'];

      // If there is a token, we want to confirm it so that we can set the
      // special access variables.
      if (token) {

        // Verify the JWT.
        jwt.verify(token, this._config.database.secret, (error, decoded) => {

          // If verification fails, we won't add the special access variables.
          // If authentication is required, this will cause the endpoint to
          // fail.
          if (error) return;

          // Create or expand the context for each request.
          request.context = Object.assign({}, request.context, {
            user:           decoded.id,
            authenticated:  true,
          });
        });
      }

      // Show that we're done here and can continue processing the request.
      next();
    });
  }

  /**
   *  Private method to automatically import endpoints from all Javascript files
   *  in the 'endpoints' directory that lives in the 'Api' directory.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _installEndpoints = app => {

    // Construct the path to the endpoints directory.
    const endpointsDirectory = __dirname + '/endpoints';

    /**
     *  Helper function to read a directory so that we can call it recursively.
     *  @param    {string}        directory     Name of the directory.
     */
    const readDirectory = directory => {

      // Get the files in this directory.
      const files = fs.readdirSync(directory);

      // Loop through all the files.
      for (const file of files) {

        // Get the full path to the file by adding the directory.
        const fullPath = path.join(directory, file);

        // If this is a directory, we should explore it recursively instead.
        if (fs.lstatSync(fullPath).isDirectory()) readDirectory(fullPath);

        // We shouldn't process anything but Javascript files here.
        else if (file.toLowerCase().endsWith('.js')) {

          // Get the relative path in the endpoints directory without the '.js'
          // extension.
          const apiPath = fullPath.replace(endpointsDirectory, "").slice(0, -3);

          // Import this endpoint and supply the path to this endpoint.
          require(fullPath)(app, '/api' + apiPath);
        }
      }
    };

    // Start by reading the top level endpoints directory.
    readDirectory(endpointsDirectory);
  }

  /**
   *  Private method to start listening forincoming requests.
   *  @param    {EventEmitter}    app     The express application object.
   *  @param    {string}          host    The host we need to listen for.
   *  @param    {number}          port    The port we need to listen for.
   */
  _listen = (app, host, port) => {

    // First, wait for the database to connect.
    this._database.connect().catch(console.error).then(async () => {

      // Make sure that the object storage is set up correctly.
      this._storage.verify().catch(console.error).then(async () => {

        // Then start listening at the API port.
        app.listen(port, () => {

          // Tell the command terminal where we're listening for incoming
          // requests.
          console.log(
            `Hosting API at http://${host}:${port}.`
          );
        });
      });
    });
  }
}

// Export the Api class so it can be imported elsewhere.
module.exports = Api;
