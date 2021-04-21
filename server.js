// Load dependencies.
const express = require('express');

// Get the express application object.
const app = express();

// Set the port to use.
const port = 8000;

// Serve the static files.
app.use(express.static('public'));

// Serve QuaggaJS.
app.use('/quagga', express.static('node_modules/quagga/dist'));

// Serve jQuery.
app.use('/jquery', express.static('node_modules/jquery/dist'));

// Serve Aframe.
app.use('/aframe', express.static('node_modules/aframe/dist'));

// Process a root page request.
app.get('/', (request, response) => {

  // Serve the barcode scanner.
  response.sendFile("html/barcodescanner.html", { root: __dirname + '/public' });
});

// Process a hit test page request.
app.get('/hit-test', (request, response) => {

  // Serve the AR Hit test page.
  response.sendFile("html/hit-test2.html", { root: __dirname + '/public' });
})

// Start listening on the designated port.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
