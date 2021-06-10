/**
 *  This is the main file that initializes the API with the current environment
 *  variables.
 */

// Use dotenv to read the local environment variables.
require('dotenv').config();

// Import API.
const Api = require('./Api.js');

// Start serving the API.
const api = new Api({

  // The API will need to know where to listen for requests.
  api: {
    host:       process.env.HOST,
    port:       process.env.PORT,

    // Get the local token that will be used to hash the authentication tokens.
    // WARNING: refreshing this token will invalidate all current tokens, even
    // if they've not yet expired.
    secret:     process.env.TOKEN_SECRET,
  },

  // The API will need credentials to connect to the database.
  database: {
    name:       process.env.DATABASE_NAME,
    user:       process.env.DATABASE_USERNAME,
    password:   process.env.DATABASE_PASSWORD,

    // Get the host and the port that point to the object storage.
    host:       process.env.DATABASE_HOST,
    port:       process.env.DATABASE_PORT,

  },

  // The API will also need credentials to connect to the object storage.
  storage: {

    // Get the secret key and the access key.
    accessKey:  process.env.STORAGE_ACCESS_KEY,
    secretKey:  process.env.STORAGE_SECRET_KEY,

    // Get the host and the port that point to the object storage.
    host:       process.env.STORAGE_HOST,
    port:       process.env.STORAGE_PORT,
  }
});