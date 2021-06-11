/**
 *  This is the main file that initializes the client with the current
 *  environment variables.
 */

// Use dotenv to read the local environment variables.
require('dotenv').config();

// Import the client.
const Client = require('./Client.js');

// Start serving the client. It will need to know where to listen for incoming
// requests.
const client = new Client({
  host: process.env.HOST,
  port: process.env.PORT,
  mode: process.env.NODE_ENV,
});
