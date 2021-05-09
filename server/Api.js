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

    // Load libraries.
    const express = require('express');

    // Get the express application object.
    const app = express();

    // Store the config for reference.
    this._config = config;

    // Install middleware.
    this._installMiddelware(app, express);

    // Connect to the database.
    // this._connectDatabase();

    // For every request, we want to try processing authentication.
    this._installAuthentication(app);

    // Now we can load all of our API endpoints.
    this._installRoutes(app);

    // Start listening for incoming requests.
    this._listen(app);
  }

  /**
   *  Private method to automatically import routes from all Javascript files in
   *  the 'routes' directory that lives in the 'Api' directory.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _installRoutes = app => {

    // We need to be able to read files and manipulate paths.
    const fs = require('fs');
    const path = require('path');

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

        // If this is a Javascript file, we import the routes.
        else if (file.toLowerCase().endsWith('.js')) require(fullPath)(app);
      }
    };

    // Start by reading the top level routes directory.
    readDirectory(__dirname + '/Api/routes');
  }

  /**
   *  Private method to install the middleware we want to use. These are all
   *  modifications on request parameters before handling the call.
   *  @param    {EventEmitter}    app     The express application object.
   *  @param    {Function}        express The express library object.
   */
  _installMiddelware = (app, express) => {

    // Import the CORS library.
    const cors = require('cors');

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
    app.use((request, response, next) => {

      // If there is a JWT on the body text, we should try to authenticate this
      // user here for easier processing along the line.
      if (request.body.token) {

        // Create the context for this request.
        request.context = {

          // @TODO Actually process the JWT.
          user: 0,
          authenticated: true,
        }
      }

      // Show that we're done here and can continue processing the request.
      next();
    })
  }

  /**
   *  Private method to connect to the database.
   *  @TODO Actually connect to a real database.
   */
  _connectDatabase = () => {

    // Load the MySQL dependency.
    const mysql = require('mysql');

    // Set up the database connection.
    this._database = mysql.createConnection({
      host:       this._config.api.host,
      user:       this._config.database.user,
      password:   this._config.database.password,
      database:   this._config.database.name,
    });
  }

  /**
   *  Private method to start listening forincoming requests.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _listen = app => {

    // Start listening at the API port.
    app.listen(this._config.api.port, () => {

      // Tell the command terminal where we're listening for incoming requests.
      console.log(
        `Hosting API at ${this._config.api.host}:${this._config.api.port}.`
      );
    });
  }
}

// Export the Api class so it can be imported elsewhere.
module.exports = Api;
