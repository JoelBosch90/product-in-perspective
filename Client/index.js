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
  client: {
    port:       process.env.CL_PORT,
    host:       process.env.CL_HOST,
  },

  // The client will need to know where to send API requests.
  api: {
    port:       process.env.API_HOST,
    host:       process.env.API_PORT,
  },
});
