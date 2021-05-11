// Load libraries.
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Get access to the Database class.
const Database = require('./Database.js');
const { models } = require('mongoose');

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
   *      @property {integer}   port        The API application port.
   *    @property {object}    database    The database credentials.
   *      @property {string}    name        The name of the database.
   *      @property {string}    user        The username for connecting to the
   *                                        database.
   *      @property {string}    password    The password for connecting to the
   *                                        database.
   */
  constructor(config) {

    // Get the express application object.
    const app = express();

    // Store the config for reference.
    this._config = config;

    // Connect to the database.
    this._connectDatabase(app);

    // Install external middleware.
    this._installMiddelware(app, express);

    // For every request, we want to try processing authentication.
    this._installAuthentication(app);

    // Now we can load all of our API endpoints.
    this._installEndpoints(app);

    // Start listening for incoming requests.
    this._listen(app);
  }

  /**
   *  Private method to connect to the database.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _connectDatabase = app => {

    // Start the new database.
    this._database = new Database(this._config.database);

    // Install new middleware on the Express app.
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
   *  Private method to install the middleware we want to use. These are all
   *  modifications on request parameters before handling the call.
   *  @param    {EventEmitter}    app     The express application object.
   *  @param    {Function}        express The express library object.
   */
  _installMiddelware = (app, express) => {

    // Use the CORS library to manage CORS headers for external connections.
    app.use(cors());

    // We need to get access to the request data in the request's body object.
    // In this API, we want to use JSON objects to communicate with the client.
    app.use(express.json());
    app.use(express.urlencoded({

      // We want to be able to use nested objects.
      extended: true
    }));
  }

  /**
   *  Private method to install middleware to authenticate each request.
   *  @param    {EventEmitter}    app     The express application object.
   */
   _installAuthentication = app => {
    app.use(async (request, response, next) => {

      // If there is a JWT on the body text, we should try to authenticate this
      // user here for easier processing along the line.
      if (request.body.token) {

        // Create or expand the context for each request.
        request.context = Object.assign({}, request.context, {

          // @TODO Actually process the JWT.
          user: await request.context.models.User.findOne({
            email: 'henk@henk.nl',
          }),
          authenticated: true,
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
    const endpointsDirectory = __dirname + '/Api/endpoints';

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

          // Get the relative path in the endpoints directory without the
          // extension.
          const apiPath = fullPath.replace(endpointsDirectory, "").slice(0, -3);

          // Import this endpoint and supply the path to this endpoint.
          require(fullPath)(app, apiPath);
        }
      }
    };

    // Start by reading the top level endpoints directory.
    readDirectory(endpointsDirectory);
  }

  /**
   *  Private method to start listening forincoming requests.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _listen = app => {

    // First, wait for the database to connect.
    this._database.connect().then(async () => {

      // //------------------------------<TESTING>---------------------------------
      // const models = this._database.models();
      // await Promise.all([models.User.deleteMany({})]);

      // (async () => {
      //   const user1 = new models.User({
      //     email: 'henk@henk.nl',
      //     password: 'abc',
      //   });
      //   const user2 = new models.User({
      //     email: 'albert@albert.nl',
      //     password: 'abcdef',
      //   });

      //   await user2.save();
      //   await user1.save();
      // })();
      // //------------------------------</TESTING>--------------------------------

      // Then start listening at the API port.
      app.listen(this._config.api.port, () => {

        // Tell the command terminal where we're listening for incoming
        // requests.
        console.log(
          `Hosting API at ${this._config.api.host}:${this._config.api.port}.`
        );
      });
    });
  }
}

// Export the Api class so it can be imported elsewhere.
module.exports = Api;
