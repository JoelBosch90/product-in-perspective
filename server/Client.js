// Load libraries.
const express = require('express');
const env = require('dotenv').config();

/**
 *  The definition of the Client class component that is used to serve all
 *  client side resources.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Client {

  /**
   *  Reference to the configuration object.
   *  @var      {object}
   */
  _config = {};

  /**
   *  Class constructor.
   *  @param    {object}    config      The configuration object.
   *    @property {object}    client      The client part of the configuration.
   *      @property {string}    host        The client application host.
   *      @property {integer}   port        The client application port.
   *    @property {object}    api         The API part of the configuration.
   *      @property {string}    host        The API application host.
   *      @property {integer}   port        The API application port.
   */
  constructor(config = {}) {

    // Get the express application object.
    const app = express();

    // Store the config for reference.
    this._config = config;

    // Start serving everything that we need to serve the client side
    // application.
    this._serveStaticFiles(app);
    this._serveLibraries(app);
    this._servePages(app);

    // Start listening for incoming requests.
    this._listen(app);
  }

  /**
   *  Private method for serving the static files.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _serveStaticFiles = app => {

    // Serve the static files.
    app.use(express.static(__dirname  + '/Client/dist'));
  }

  /**
   *  Private method for serving the client-side Javascript libraries.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _serveLibraries = app => {

    // QuaggaJS is needed for the barcode scanner.
    app.use('/quagga',express.static(
      __dirname  + '/Client/node_modules/quagga/dist'
    ));

    // Aframe is needed for the augmented reality scene.
    app.use('/aframe', express.static(
      __dirname  + '/Client/node_modules/aframe/dist'
    ));
  }

  /**
   *  Private method for serving the HTML pages.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _servePages = app => {

    // Process a root page request.
    app.get('/', (request, response) => {

      // Serve the product preview file containing the default app.
      response.sendFile("/html/productpreview.html", {
        root: __dirname  + '/Client/dist'
      });
    });

    // Process an admin login page request.
    app.get('/admin', (request, response) => {

      // Serve the admin file to start the admin environment.
      response.sendFile("/html/admin.html", {
        root: __dirname + '/Client/dist'
      });
    });
  }

  /**
   *  Private method to start listening forincoming requests.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _listen = app => {

    // Start listening at the client port.
    app.listen(this._config.client.port, () => {

      // Tell the command terminal where we're listening for incoming requests.
      console.log(
        `Hosting client at ${this._config.client.host}:${this._config.client.port}.`
      );
    });
  }
}

// Export the Client class so it can be imported elsewhere.
module.exports = Client;
