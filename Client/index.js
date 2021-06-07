/**
 *  This is the main file that initializes the client with the current
 *  environment variables.
 */

// Use dotenv to read the local environment variables.
require('dotenv').config();

// Import the client.
const Client = require('./Client.js');

// Start serving the client.
const client = new Client({

  // The client will need to know where to listen for requests.
  port:       process.env.CL_PORT,
  host:       process.env.CL_HOST,
});
