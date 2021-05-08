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

// Serve the Javascript libraries that we'll need to be able to access
// client-side.
app.use('/quagga', express.static('node_modules/quagga/dist'));
app.use('/aframe', express.static('node_modules/aframe/dist'));

// Process a root page request.
app.get('/', (request, response) => {

  // Serve the product preview file containing the default app.
  response.sendFile("html/productpreview.html", { root: __dirname + '/dist' });
});

// Process an admin login page request.
app.get('/admin', (request, response) => {

  // Serve the admin file containing the admin environment
  response.sendFile("html/admin.html", { root: __dirname + '/dist' });
});

// Start listening to the server port and announce the proper port in the
// console.
app.listen(PORT, () => void console.log(`Hosting at localhost:${PORT}.`));
