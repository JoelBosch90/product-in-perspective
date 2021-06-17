// Load libaries.
const fs = require('fs-extra');
const crypto = require('crypto');
const path = require('path');
const Minio = require('minio');
const StreamZip = require('node-stream-zip');
const gltfPipeline = require('gltf-pipeline');
const obj2gltf = require('obj2gltf');
const fbx2gltf = require('fbx2gltf');

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
   *  Reference to the object storage client.
   *  @var      {Minio.Client}
   */
  _client = {};

  /**
   *  Dictionary indicating the supported combinations of extension and MIME
   *  type for our models.
   *  @var      {Object}
   */
  _supportedModels = {};

  /**
   *  Class constructor.
   *  @param    {string}    bucketName  The name of the bucket we use in this
   *                                    storage.
   *  @param    {object}    config      The configuration object.
   *    @property {string}    host        The URL for connecting to the object
   *                                      storage.
   *    @property {number}    port        The port for connecting to the
   *                                      object storage.
   *    @property {string}    accessKey   The access key for the storage.
   *    @property {string}    secretKey   The secret key for the storage.
   */
  constructor(bucketName, config) {

    // Store the bucket name.
    this._bucket = bucketName;

    // Create a new object storage client.
    this._client = new Minio.Client({
      endPoint:   config.host,
      port:       Number(config.port),
      useSSL:     false,
      accessKey:  config.accessKey,
      secretKey:  config.secretKey,
    });

    // Define the models that we support.
    this._supportedModels = {
      'zip': {
        mimes:     ['application/x-zip-compressed'],
        convert:  this._zipToGlb2,
      },
      'gltf': {
        mimes:     ['application/octet-stream'],
        convert:  this._gltfToGlb2,
      },
      'glb': {
        mimes:     ['application/octet-stream'],
        convert:  this._glbToGlb2,
      },
      'obj': {
        mimes:     ['?'],
        convert:  this._objToGlb2,
      },
      'fbx': {
        mimes:     ['?'],
        convert:  this._fbxToGlb2,
      },
    }
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
        if (!exists) {

          // First create the bucket for the models.
          await this._client.makeBucket(this._bucket).catch(reject);

          // Minio uses the Amazon S3 API format, so we can base our policy on
          // this example: https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html#example-bucket-policies-use-case-2
          // In this case, we want to make the models publicly accessible.
          const policy = JSON.stringify({

            // This is the specific AWS policy version that we're using.
            Version:      "2012-10-17",
            Statement:[
              {
                Sid:        "PublicRead",
                Effect:     "Allow",
                Principal:  "*",
                Action:     ["s3:GetObject","s3:GetObjectVersion"],
                Resource:   ["arn:aws:s3:::" + this._bucket + "/*"],
              },
            ],
          });

          // Make sure we set the policy.
          await this._client.setBucketPolicy(this._bucket, policy).catch(reject);
        }

        // Now we can simply resolve the promise to confirm that we have a
        // bucket.
        return resolve(true);
      });
    });
  }

  /**
   *  This is a method that takes a base64 encoded model. It will decode the
   *  model, temporarily store it on hard disk, attempt to convert the model to
   *  glb2 2.0, and then store that model in the object storage.
   *  @param    {Object}    file        An object that represents the encoded
   *                                    file.
   *    @property {string}    extension   The original file extension.
   *    @property {string}    file        The base64 encoded file string.
   *  @param    {string}    name        The name to use to store this model.
   *  @returns  {Promise}
   */
  storeModel = async (file, name) => {

    // Check if we support a file with this extension.
    if (!(file.extension in this._supportedModels)) throw new Error("Unsupported file type.");

    // First check if the MIME type matches the extension.
    if (!this._expectedMimeType(file)) throw new Error("Invalid file.");

    // First, we want to temporarily store the file on hard disk so that we can
    // process it before we transfer it to the object storage.
    const tempFile = await this._saveTempFile(file.file, file.extension);

    // Convert the temporary file to a glb 2.0 file.
    const glb2 = await this._toGlb2(tempFile);

    // Check if we did indeed find a model.
    if (!glb2) throw Error("No model found.");

    // Now move the glb2 to the object storage and return the name of the new
    // file.
    return this.storeFile(glb2, name + '.glb');
  }

  /**
   *  This is a method that takes a base64 encoded file that we received through
   *  an HTTP request, decodes the file, stores it and then returns the path to
   *  reach that file.
   *  @param    {string}    file        The path to a file on hard disk.
   *  @param    {string}    name        The name to use to store this file.
   *  @returns  {Promise}
   */
  storeFile = async (file, name) => {

    // If no file was provided, we have nothing to store.
    if (!file) return;

    // Store the file in our object storage.
    await this._client.fPutObject(this._bucket, name, file);

    // Remove the temporary file.
    this._removeTempFile(file);

    // Return the filename for retrieving the file.
    return name;
  }

  /**
   *  This is a method that attempts to remove the file with this file name, if
   *  it exists.
   *  @param    {string}    id        The model's id.
   *  @returns  {Promise}
   */
  delete = async id => {

    // Remove the file.
    return this._client.removeObject(this._bucket, id + '.glb');
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
   *  Method to convert any supported file type to a GLTF 2.0 model.
   *  @param    {string}    file        The path to the file that is to be
   *                                    converted.
   *  @return   {Promise}
   */
  _toGlb2 = async file => {

    // Get the file extension from the path.
    const extension = this._extension(file);

    // Use the stored convert method for this file extension.
    return this._supportedModels[extension].convert(file);
  }

  /**
   *  Helper method to get the extension from a file path.
   *  @param    {string}  file        The full path to the file.
   *  @returns  {string}
   */
  _extension = file => file.split(".").pop();

  /**
   *  Helper method to get the mime type from a base64 encoded file string.
   *  @param    {string}  file        The full path to the file.
   *  @returns  {string}
   */
  _mimeType = file => file.split(";base64,")[0].slice(5);

  /**
   *  Check whether this file object's extension and MIME type is supported.
   *  @param    {Object}    fileObject  An object that represents the encoded
   *                                    file.
   *    @property {string}    extension   The original file extension.
   *    @property {string}    file        The base64 encoded file string.
   *  @returns  {boolean}
   */
  _expectedMimeType = ({ file, extension }) => {

    // Get the actual MIME type from the file.
    const actual = this._mimeType(file);

    // Get the MIME type that we expect.
    const expected = this._supportedModels[extension].mimes;

    // Check if these match.
    return expected.includes(actual);
  }

  /**
   *  Method to convert a zip file to a GLB 2.0 model.
   *  @param    {string}    file        The path to the file that is to be
   *                                    converted.
   *  @return   {Promise}
   */
  _zipToGlb2 = async file => {

    // Open the zip file.
    const zip = new StreamZip.async({ file });

    // Create a new file path to extract the archive to.
    const directoryPath = this._getFilePath();

    // Create the new directory to extract to.
    fs.mkdirSync(directoryPath);

    // Extact to the new directory.
    await zip.extract(null, directoryPath);

    // See if we can find a model here.
    const modelPath = await this._findModel(directoryPath);

    // Close the archive.
    await zip.close();

    // Clean up the archive.
    this._removeTempFile(file);

    // Clean up the extraction folder.
    await fs.rmdir(directoryPath, { recursive: true });

    // Return the model we found.
    return modelPath;
  }

  /**
   *  Method to recursively search directories to find a model to use. It will
   *  first try to find a model in this directory, then in subdirectories, then
   *  in zipfiles in this directory. It returns at most the first model it
   *  finds.
   *  @param    {string}    parent      The path to the directory in which the
   *                                    model is to be found.
   *  @returns  {Promise}
   */
  _findModel = async parent => {

    // Get the files in this directory.
    const files = fs.readdirSync(parent);

    // We want to initially ignore directories.
    const directories = [];

    // We want to initially ignore zip files.
    const zips = [];

    // Loop through all the files.
    for (const file of files) {

      // Get the full path to the file by adding the directory.
      const fullPath = parent + '/' + file;

      // Get the file extension from the file name.
      const extension = this._extension(file);

      // If this is a directory, we should save it for now. We want to search
      // files in the parent directory first.
      if (fs.lstatSync(fullPath).isDirectory()) directories.push(fullPath);

      // If this is a zip file, we should save it for now. We want to search
      // for models in the parent directory and subdirectories first.
      if (extension == 'zip') zips.push(fullPath);

      // Check if this is a supported filetype.
      if (extension in this._supportedModels) return this._toGlb2(fullPath);
    }

    // If we still haven't found a model, we should recursively search all
    // subdirectories.
    for (const directory of directories) {

      // Search this directory for a model.
      const model = await this._findModel(directory);

      // If we found a model, we should return it!
      if (model) return model;
    }

    // If we still haven't found a model, we should recursively search all zip
    // files.
    for (const zip of zips) {

      // Search this directory for a model.
      const model = await this._zipToGlb2(zip);

      // If we found a model, we should return it!
      if (model) return model;
    }

    // Seems we couldn't find any model at all.
    return false;
  }

  /**
   *  Method to convert a GLTF file to a GLB 2.0 model.
   *  @param    {string}    file        The path to the file that is to be
   *                                    converted.
   *  @return   {Promise}
   */
  _gltfToGlb2 = async file => {

    // The .glTF files adhere to JSON format, so we can simply read these
    // files by parsing them as JSON strings.
    const gltf = fs.readJsonSync(file);

    // Get the path to the directory for this model.
    const resourceDirectory = path.dirname(file);

    // Convert to a binary version GLTF 2.0 that does not reference any
    // external files. This makes it easier to store and serve on the web.
    const result = await gltfPipeline.gltfToGlb(gltf, { resourceDirectory });

    // Get a path with the .glb extension.
    const newPath = this._getFilePath('glb');

    // Write the result to the same temporary directory.
    fs.writeFileSync(newPath, result.glb);

    // Remove the old file.
    await this._removeTempFile(file);

    // And resolve to the path for the new GLB file.
    return newPath;
  }

  /**
   *  Method to convert a GLB file to a GLB 2.0 model.
   *  @param    {string}    file        The path to the file that is to be
   *                                    converted.
   *  @return   {Promise}
   */
  _glbToGlb2 = async file => {

    // It could be that this model is already in GLTF 2.0 format, but we cannot
    // tell while it is in binary state. So we need to read it and convert it to
    // GLTF first to see if we should convert to 2.0 or not.
    const glb = fs.readFileSync(file);

    // Convert the GLB to gltf.
    const gltf = await gltfPipeline.glbToGltf(glb);

    // If this model is already version 2, we can simply store the originally
    // uploaded file.
    if (gltf.asset && Number(gltf.asset.version) >= 2) return file;

    // Otherwise, we can simply convert it back to GLB format. The pipeline will
    // automatically convert it to version 2.0.
    const result = await gltfPipeline.gltfToGlb(gltf);

    // Get new a path with the .glb extension.
    const newPath = this._getFilePath('glb');

    // Write the result to the same temporary directory.
    fs.writeFileSync(newPath, result.glb);

    // Remove the old file.
    await this._removeTempFile(file);

    // And resolve to the path for the new GLB file.
    return newPath;
  }

  /**
   *  Method to convert an OBJ file to a GLB 2.0 model.
   *  @param    {string}    file        The path to the file that is to be
   *                                    converted.
   *  @return   {Promise}
   */
  _objToGlb2 = async file => {

    // Convert the OBJ file to GLB.
    const glb = await obj2gltf(file, {
      binary: true,
      unlit: true
    });

    // Get a path with the .glb extension.
    const newPath = this._getFilePath('glb');

    // Write the result to the same temporary directory.
    fs.writeFileSync(newPath, glb);

    // Remove the old file.
    await this._removeTempFile(file);;

    // And resolve to the path for the new GLB file.
    return newPath;
  }

  /**
   *  Method to convert an FBX file to a GLB 2.0 model.
   *  @param    {string}    file        The path to the file that is to be
   *                                    converted.
   *  @return   {Promise}
   */
  _fbxToGlb2 = async file => {

    // Get a path with the .glb extension.
    const newPath = this._getFilePath('glb');

    // Convert the OBJ file to GLB.
    await fbx2gltf(file, newPath);

    // Remove the old file.
    await this._removeTempFile(file);

    // And resolve to the path for the new GLB file.
    return newPath;
  }

  /**
   *  Method to remove a file that is temporarily stored on hard disk.
   *  @param    {string}    file      The path where the temporary file can be
   *                                  found.
   *  @returns  {Promise}
   */
  _removeTempFile = async file => {

    // Try to remove a file and return a promise.
    return fs.unlink(file);
  }

  /**
   *  Private helper method that decodes a base64 encoded file back to a file
   *  and attempts to store it in a temporary folder. It will return a promise
   *  that will resolve into the filepath on success.
   *  @param    {string}    file        The base64 encoded file.
   *  @param    {string}    extension   The extension that this file should get.
   *  @returns  {Promise}
   */
  _saveTempFile = (file, extension) => {

    // Return a promise.
    return new Promise((resolve, reject) => {

      // Build the entire filename string.
      const filePath = this._getFilePath(extension);

      // Strip off the metadata header.
      const decoded = file.split(";base64,").pop();

      // Try to write the file to this path.
      fs.writeFile(filePath, decoded, { encoding: 'base64' }, error => {

        // If writing failed, reject the promise.
        if (error) reject(error);

        // Otherwise, we can assume it worked and resolve the promise.
        else resolve(filePath);
      });
    });
  }

  /**
   *  A helper method to create a unique file path.
   *  @param    {string}    fileType    An optional file type to add an
   *                                    extension.
   *  @returns  {string}
   */
  _getFilePath = fileType => {

    // We want to create a unique filename. It is technically possible for two
    // requests to store a file at the exact same time so to prevent conflicts,
    // we need to add random to greatly decrease the likeliness of conflicts.
    const random = crypto.randomBytes(10).toString('hex');

    // If we have a file type, we need to construct the extension by added a
    // dot.
    const extension = fileType ? '.' + fileType : '';

    console.log(fs.existsSync(__dirname + '/Storage/tmp/'))

    // Create a path to a random file name plus the current time in the
    // temporary directory.
    return __dirname + '/Storage/tmp/' + random + '-at-' + Date.now() + extension;
  }
}

// Export the Storage class so it can be imported elsewhere.
module.exports = Storage;
