// Load dependencies.
const express = require('express');

// Get the express application object.
const app = express();

// Set the port to use.
const port = 8000;

// Serve the static files.
app.use(express.static('public'));

// Serve QuaggaJS.
app.use('/quagga', express.static('quaggaJS/dist'));

app.use('/jquery', express.static('node_modules/jquery/dist'));

// Serve the barcode scanner at the root page.
app.get('/', (request, response) => {
  response.sendFile("html/barcodescanner.html", { root: __dirname + '/public' });
  
});

// Start listening on the designated port.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
