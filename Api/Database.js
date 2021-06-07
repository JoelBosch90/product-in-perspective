// Load libaries.
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

/**
 *  The definition of the Database class component that acts as the interface
 *  for the database.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Database {

  /**
   *  Reference to the configuration object.
   *  @var      {object}
   */
  _config = {};

  /**
   *  Class constructor.
   *  @param    {object}    config      The configuration object.
   *    @property {string}    name        The name of the database.
   *    @property {string}    user        The username for connecting to the
   *                                      database.
   *    @property {string}    password    The password for connecting to the
   *                                      database.
   *    @property {string}    secret      The database secret for creating
   *                                      tokens.
   *    @property {string}    host        The URL to connect to the database.
   *    @property {number}    port        The port to connect to the database.
   */
  constructor(config) {

    // Store the configuration.
    this._config = config;
  }

  /**
   *  Method for connecting to the database.
   *  @returns  {Promise}
   */
  connect = () => {

    // If there a user was passed in the config, that means that we're running
    // in production.
    const connectUrl = this._config.user

      // In production, we need to authenticate when connecting to the database.
      ? `mongodb://${this._config.user}:${this._config.password}@${this._config.host}:${this._config.port}/node-express-mongodb-server?authSource=admin`

      // In development, this is not needed. We can load the URL as is.
      : `mongodb://${this._config.host}:${this._config.port}/node-express-mongodb-server?authSource=admin`;

    // Use the URL to connect to the database. Return the connection promise.
    return mongoose.connect(connectUrl);
  }

  /**
   *  Method for exposing the database models.
   *  @returns  {object}
   */
  models = () => {

    // Start building an object for all model classes.
    const models = {};

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

        // Ignore all but Javascript files.
        else if (file.toLowerCase().endsWith('.js')) {

          // Get the model.
          const model = require(fullPath);

          // Add the model to the object.
          Object.assign(models, { [model.modelName]: model })
        }
      }
    };

    // Start by reading the top level models directory.
    readDirectory(__dirname + '/Database/models');

    // Return the object that contains all model classes.
    return models;
  }
}

// Export the Database class so it can be imported elsewhere.
module.exports = Database;
