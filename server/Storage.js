// Load libaries.
const Minio = require("minio");
const multer = require('multer');

/**
 *  The definition of the Storage class component that acts as the interface
 *  for the object storage.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Storage {

  /**
   *  Reference to the configuration object.
   *  @var      {object}
   */
  _config = {};

  /**
   *  Reference to the object storage client.
   *  @var      {Minio.Client}
   */
  _client = {};

  /**
   *  Class constructor.
   *  @param    {object}    config      The configuration object.
   *    @property {string}    url         The URL for connecting to the object
   *                                      storage.
   *    @property {number}    port        The port for connecting to the
   *                                      object storage.
   *    @property {string}    accessKey   The access key for the storage.
   *    @property {string}    secretKey   The secret key for the storage.
   */
  constructor(config) {

    // Store the configuration.
    this._config = config;

    // Create a new object storage client.
    // this._client = new Minio.Client({
    //   endPoint:   this._config.url,
    //   port:       Number(this._config.port),
    //   useSSL:     true,
    //   accessKey:  this._config.accessKey,
    //   secretKey:  this._config.secretKey,
    // });

    // TEST with disk storage.
    // @TODO Replace with object storage.
    this._client = multer({
      storage: multer.diskStorage({

        // For now, let's store in a temporary folder.
        destination: (request, file, callback) => {
          callback(null, '/tmp/uploads');
        },

        // And use the name of the file with the current date to create somewhat
        // unique names.
        filename: (request, file, callback) => {
          callback(null, file.fieldname + '-' + Date.now());
        },
      }),
    });
  }

  /**
   *  Method exposing the object storage client.
   *  @returns  {Minio.Client}
   */
  client = () => {

    // Return the instance of the Minio client.
    return this._client;
  }

  /**
   *  Method for verifying that the buckets that we need are available.
   *  @returns  {Promise}
   */
  verify = () => {

    // Return a new promise.
    return new Promise((resolve, reject) => {

      // // Verify that the buckets we need exist within the object storage.
      // this._client.bucketExists("test", error => {

      //   // If we get an error, pass it on in the rejection.
      //   if (error) return reject(error);

        // Otherwise we can simply resolve the promise to say everything checks
        // out.
        return resolve(true);
      // });
    });
  }
}

// Export the Storage class so it can be imported elsewhere.
module.exports = Storage;
