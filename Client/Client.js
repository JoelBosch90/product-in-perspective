// Load libraries.
const express = require('express');

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
   *  @param    {integer}   port        The client application port.
   */
  constructor(port) {

    // Get the express application object.
    const app = express();

    // Store the absolute path to the directory that holds the public files.
    this._publicDir = __dirname  + '/public';

    // Start serving everything that we need to serve the client side
    // application.
    this._serveStaticFiles(app);
    this._serveLibraries(app);
    this._servePages(app);

    // Start listening for incoming requests.
    this._listen(app, port);
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
   */
  _servePages = app => {

    // We want to serve a single page application. This means that we should
    // serve the same index for all pages. Routing can then be solved
    // client-side without hard page reloads.
    app.get('/*', (request, response) => {

      // Serve the main index file.
      response.sendFile("/html/index.html", { root: this._publicDir });
    });
  }

  /**
   *  Private method to start listening forincoming requests.
   *  @param    {EventEmitter}    app     The express application object.
   *  @param    {string}          port    The port we should be listening to.
   */
  _listen = (app, port) => {

    // Start listening at the client port.
    app.listen(port, () => {

      // Tell the command terminal where we're listening for incoming requests.
      console.log(
        `Hosting client at port ${port}.`
      );
    });
  }
}

// Export the Client class so it can be imported elsewhere.
module.exports = Client;
