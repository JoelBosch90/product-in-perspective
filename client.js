// Load dependencies.
const http = require("http");
const fs = require("fs");

// Set port and hostname.
const hostname = 'localhost';
const port = 3000;

const getFile = (request, response, location, type) => {
  fs.readFile(location, function(error, file) {

    // Log a warning to the console in case of an error.
    console.warn(error);

    // Set the appropriate headers for the file.
    response.statusCode = 200;
    response.setHeader('Content-Type', type);

    // Send the file.
    response.end(file);
  });
};

// Create an HTTP server and prepare a response.
const server = http.createServer((request, response) => {

  // Get the JavaScript file.
  getFile(request, response, "barcodescanner.js", 'text/javascript');

  // Get the HTML page.
  getFile(request, response, "barcodescanner.html", 'text/html');
});

// Have the server listen for requests at the given location.
server.listen(port, hostname, () => {

  // Log the location to the console so we always know where to find it.
  console.log(`Server running at http://${hostname}:${port}/`);
});
