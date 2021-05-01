/**
 *  This is the main server file that serves all assets and provides routing.
 */

// Load dependencies.
const express = require('express');

// Set the port to use.
const PORT = 8000;

// Get the express application object.
const app = express();

// Serve the static files.
app.use(express.static('dist'));

// Serve QuaggaJS.
app.use('/quagga', express.static('node_modules/quagga/dist'));

// Serve jQuery.
app.use('/jquery', express.static('node_modules/jquery/dist'));

// Serve Aframe.
app.use('/aframe', express.static('node_modules/aframe/dist'));

// Process a root page request.
app.get('/', (request, response) => {

  // Serve the main index file containing the default app.
  response.sendFile("html/ar-productpreview.html", { root: __dirname + '/dist' });
});

// Process a root page request.
app.get('/ar-scene', (request, response) => {

  // Serve the old AR scene file.
  response.sendFile("html/ar-scene.html", { root: __dirname + '/dist' });
});


// Process a barcode scanner test page request.
app.get('/barcodescanner', (request, response) => {

  // Serve the AR Hit test page.
  response.sendFile("html/barcodescanner.html", { root: __dirname + '/dist' });
})

// Process a hit test page request.
app.get('/hit', (request, response) => {

  // Serve the AR Hit test page.
  response.sendFile("html/hit-test.html", { root: __dirname + '/dist' });
})

// Process a hoop test page request.
app.get('/hoop', (request, response) => {

  // Serve the basketball example test page.
  response.sendFile("html/hoop-test.html", { root: __dirname + '/dist' });
})

// Start listening to the server port and announce the proper port in the
// console.
app.listen(PORT, () => void console.log(`Hosting at ${PORT}.`));
