// Import dependencies.
const fs = require('fs');

/**
 *  Helper function that decodes a base64 encoded file back to a file and
 *  attempts to store it at the given location.
 *  @param    {string}      path      The path at which the file will be saved.
 *  @param    {string}      encoded   The base64 encoded file.
 *  @returns  {Promise}
 */
module.exports = saveEncodedFile = (path, encoded) => {

  // Return a promise.
  return new Promise((resolve, reject) => {

    // Strip off the metadata header.
    const file = encoded.split(";base64,").pop();

    // Try to write the file to this path.
    fs.writeFile(path, file, { encoding: 'base64' }, error => {

      // If writing failed, reject the promise.
      if (error) reject(error);

      // Otherwise, we can assume it worked and resolve the promise.
      else resolve(true);
    });
  });
}