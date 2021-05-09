/**
 *  This is the main server file that serves all assets and provides routing.
 */

// Import libraries.
const env = require('dotenv').config();

// Import dependencies.
const Client = require('./server/Client.js');
const Api = require('./server/Api.js');

// Run the client.
const client = new Client({

  // The client will need to know where to listen for requests.
  client: {
    port:     process.env.CPORT,
    host:     process.env.CHOST,
  },

  // The client will need to know where to send API requests.
  api: {
    port:     process.env.AHOST,
    host:     process.env.APORT,
  },
});

// Run the API.
const api = new Api({

  // The API will need to know where to listen for requests.
  api: {
    port:     process.env.APORT,
    host:     process.env.AHOST,
  },

  // The API will need credentials to connect to the database.
  database: {
    name:     process.env.DBNAME,
    user:     process.env.DBUSER,
    password: process.env.DBPWD,
  },
});
