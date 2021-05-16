/**
 *  This is the main server file that starts up all services using the local
 *  environment variables for settings.
 */

// Use dotenv to read the local environment variables.
require('dotenv').config();

// Import the different services.
const Api = require('./server/Api.js');
const Client = require('./server/Client.js');

console.log(process.env);

// Start serving the API.
const api = new Api({

  // The API will need to know where to listen for requests.
  api: {
    port:     process.env.API_PORT,
    host:     process.env.API_HOST,
  },

  // The API will need credentials to connect to the database.
  database: {
    name:     process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PWD,

    // Get the local token that will be used to hash the authentication tokens.
    // WARNING: refreshing this token will invalidate all current tokens, even
    // if they've not yet expired.
    secret:   process.env.DB_TOKEN_SECRET,

    // Get the URL where the database will be served.
    url:      process.env.DB_URL
  },
});

// Start serving the client.
const client = new Client({

  // The client will need to know where to listen for requests.
  client: {
    port:     process.env.CL_PORT,
    host:     process.env.CL_HOST,
  },

  // The client will need to know where to send API requests.
  api: {
    port:     process.env.API_HOST,
    host:     process.env.API_PORT,
  },
});
