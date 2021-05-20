// Load libaries.
const Minio = require("minio");
const fs = require('fs');
const crypto = require('crypto');

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
   *  Reference to the bucket name.
   *  @var      {string}
   */
  _bucket = null;

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
   *  @param    {string}    bucketName  The name of the bucket we use in this
   *                                    storage.
   *  @param    {object}    config      The configuration object.
   *    @property {string}    url         The URL for connecting to the object
   *                                      storage.
   *    @property {number}    port        The port for connecting to the
   *                                      object storage.
   *    @property {string}    accessKey   The access key for the storage.
   *    @property {string}    secretKey   The secret key for the storage.
   */
  constructor(bucketName, config) {

    // Store the bucket name.
    this._bucket = bucketName;

    // Store the configuration.
    this._config = config;

    // Create a new object storage client.
    this._client = new Minio.Client({
      endPoint:   this._config.url,
      port:       Number(this._config.port),
      useSSL:     true,
      accessKey:  this._config.accessKey,
      secretKey:  this._config.secretKey,
    });
  }

  /**
   *  Method for verifying that the buckets that we need are available.
   *  @returns  {Promise}
   */
  verify = () => {

    // Return a new promise.
    return new Promise((resolve, reject) => {

      // Verify that the buckets we need exist within the object storage.
      this._client.bucketExists(this._bucket).catch(reject).then(async exists => {

        // If there is no bucket for models yet, we should create one first.
        if (!exists) await this._client.makeBucket(this._bucket).catch(reject);

        // Now we can simply resolve the promise to confirm that we have a
        // bucket.
        return resolve(true);
      });
    });
  }

  /**
   *  This is a method that takes a base64 encoded file that we received through
   *  an HTTP request, decodes the file, stores it and then returns the path to
   *  reach that file.
   *  @param    {File}      file     The base64 encoded file that we received.
   *  @returns  {Promise}
   */
  store = async file => {

    // If no file was provided, we have nothing to store.
    if (!file) return;

    // First, we want to temporarily store the file on hard disk before we
    // transfer it to the object storage.
    const tempPath = await this._storeTempFile(file);

    // Get the last part after the '/tmp/' directory from the temporary path go
    // get the file name.
    const fileName = tempPath.split('/tmp/').pop();

    console.log(this._bucket, fileName, tempPath);

    // Store the file in our object storage.
    await this._client.fPutObject(this._bucket, fileName, tempPath);

    // Return the filename use for retrieving the file.
    return fileName;
  }


  /**
   *  Get a presigned temporary URL that points to the request file.
   *  @param    {string}    fileName    The name of the file.
   *  @returns  {Promise}
   */
  retrieveUrl = async fileName => {

    // Get the object from the storage. We want this URL to be available for 12
    // hours (or 43200 seconds).
    return this._client.presignedUrl('GET', this._bucket, fileName, 43200);
  }

  /**
   *  Private helper method that decodes a base64 encoded file back to a file
   *  and attempts to store it in a temporary folder. It will return a promise
   *  that will resolve into the filepath on success.
   *  @param    {string}      file    The base64 encoded file.
   *  @returns  {Promise}
   */
  _storeTempFile = file => {

    // Return a promise.
    return new Promise((resolve, reject) => {

      // We want to create a unique filename. It is technically possible for two
      // requests to store a file at the exact same time so to prevent conflicts,
      // we need to add random to greatly decrease the likeliness of conflicts.
      const random = crypto.randomBytes(10).toString('hex');

      // Build the entire filename string.
      const path = __dirname + '/Storage/tmp/' + random + '-at-' + Date.now() + '.png';

      // Strip off the metadata header.
      const decoded = file.split(";base64,").pop();

      // Try to write the file to this path.
      fs.writeFile(path, decoded, { encoding: 'base64' }, error => {

        // If writing failed, reject the promise.
        if (error) reject(error);

        // Otherwise, we can assume it worked and resolve the promise.
        else resolve(path);
      });
    });
  }
}

// Export the Storage class so it can be imported elsewhere.
module.exports = Storage;
