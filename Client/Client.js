// Load libraries.
const express = require('express');
const rateLimit = require("express-rate-limit");

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
   *  Absolute path to the directory that hosts public files.
   *  @var      {string}
   */
  _publicDir = null;

  /**
   *  Class constructor.
   *  @param    {object}    config      The configuration object.
   *    @property {string}    host        The client application host.
   *    @property {number}    port        The client application port.
   *    @property {string}    mode        The current Node enviroment mode.
   */
  constructor(config = {}) {

    // Get the express application object.
    const app = express();

    // Store the absolute path to the directory that holds the public files.
    this._publicDir = __dirname  + '/public';

    // First, install the middleware we want to use.
    this._installMiddleware(app, config.mode);

    // Start serving everything that we need to serve the client side
    // application.
    this._serveStaticFiles(app);
    this._serveLibraries(app);
    this._servePages(app, config.mode);

    // Start listening for incoming requests.
    this._listen(app, config.host, config.port);
  }

  /**
   *  Private method to install the middleware we want to use. These are all
   *  modifications on request parameters before handling the call.
   *  @param    {EventEmitter}    app     The express application object.
   *  @param    {string}          mode    The current Node enviroment mode.
   */
  _installMiddleware = (app, mode) => {

    // We are behind a reverse proxy that we should trust.
    app.set('trust proxy', true);

    // We want to install protection against DDOS attacks if we're not running
    // in development mode.
    if (mode != 'development') app.use(rateLimit({

      // Set a limit per minute.
      windowMs: 60000,

      // Allow a maxium number of requests for a single user.
      max: 200,
    }));
  }

  /**
   *  Private method for serving the static files.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _serveStaticFiles = app => {

    // Serve the static files.
    app.use(express.static(this._publicDir));
  }

  /**
   *  Private method for serving the client-side Javascript libraries.
   *  @param    {EventEmitter}    app     The express application object.
   */
  _serveLibraries = app => {

    // QuaggaJS is needed for the barcode scanner.
    app.use('/quagga',express.static(
      __dirname  + '/node_modules/quagga/dist'
    ));

    // Aframe is needed for the augmented reality scene.
    app.use('/aframe', express.static(
      __dirname  + '/node_modules/aframe/dist'
    ));
  }

  /**
   *  Private method for serving the HTML pages.
   *  @param    {EventEmitter}    app     The express application object.
   *  @param    {string}          mode    The current Node enviroment mode.
   */
  _servePages = (app, mode) => {

    // We want to serve a single page application. This means that we should
    // serve the same index for all pages. Routing can then be solved
    // client-side without hard page reloads.
    app.get('/*', (request, response) => {

      // If we're running in development mode, we want to run the debug index
      // that loads the unbundled and unminified versions.
      const index = `/html/index${mode == 'development' ? '-debug': ''}.html`

      // Serve the main index file.
      response.sendFile(index, { root: this._publicDir });
    });
  }

  /**
   *  Private method to start listening forincoming requests.
   *  @param    {EventEmitter}    app     The express application object.
   *  @param    {string}          host    The host we need to listen for.
   *  @param    {number}          port    The port we need to listen for.
   */
  _listen = (app, host, port) => {

    // Start listening at the client port.
    app.listen(port, () => {

      // Tell the command terminal where we're listening for incoming requests.
      console.log(
        `Hosting client at port http://${host}:${port}.`
      );
    });
  }
}

// Export the Client class so it can be imported elsewhere.
module.exports = Client;
