/**
 *  This is the main server file that starts up all services using the local
 *  environment variables for settings.
 */

// Use dotenv to read the local environment variables.
require('dotenv').config();

// Import the different services.
const Api = require('./server/Api.js');
const Client = require('./server/Client.js');

// Start serving the API.
const api = new Api({

  // The API will need to know where to listen for requests.
  api: {
    port:       3000,
    host:       'localhost',
  },

  // The API will need credentials to connect to the database.
  database: {
    name:       process.env.DATABASE_NAME,
    user:       process.env.DATABASE_USER,
    password:   process.env.DATABASE_PWD,

    // Get the local token that will be used to hash the authentication tokens.
    // WARNING: refreshing this token will invalidate all current tokens, even
    // if they've not yet expired.
    secret:     process.env.TOKEN_SECRET,

    // Get the URL where the database will be served.
    url:        'localhost:27017/?authSource=admin'
  },

  // The API will also need credentials to connect to the object storage.
  storage: {

    // Get the secret key and the access key.
    accessKey:  process.env.STORAGE_ACCESS_KEY,
    secretKey:  process.env.STORAGE_SECRET_KEY,

    // Get the URL and the port that point to the object storage.
    url:        'localhost',
    port:       9000,
  }
});

// Start serving the client.
const client = new Client({

  // The client will need to know where to listen for requests.
  client: {
    port:       8000,
    host:       'localhost',
  },

  // The client will need to know where to send API requests.
  api: {
    port:       '',
    host:       'https://joelbosch.nl/api',
  },
});
