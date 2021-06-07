/**
 *  The definition of the Request class that can be used to perform HTTP
 *  requests.
 *
 *  N.B. Note that variables and methods preceeded with '_' should be treated as
 *  private, even though private variables and methods are not yet supported in
 *  Javascript classes.
 */
class Request {
  /**
   *  This is a path to the location of the API.
   *  @var      {string}
   */
  _apiUrl = "http://localhost:3000/api";
  /**
   *  This is a path to the location of the object storage.
   *  @var      {string}
   */

  _storageUrl = "http://localhost:9000/model";
  /**
   *  Class constructor.
   */

  constructor() {}
  /**
   *  Method to craft the URL to reach a model.
   *  @param    {string}    id      We need to know a model's ID to craft the
   *                                URL.
   *  @returns  {string}
   */


  model = id => {
    // Create the URL from the object storage, the models bucket, ID as the
    // filename and add the GLB extension.
    return this._storageUrl + '/' + id + '.glb';
  };
  /**
   *  Method for performing a PUT request. Returns a promise that will
   *  resolve in a Response object.
   *  @param    {string}    url     URL that points to the API endpoint.
   *  @returns  {Promise}
   */

  get = async (url = '') => {
    // Use fetch to perform the HTTP request.
    return fetch(this._apiUrl + url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('jwt')
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });
  };
  /**
   *  Method for performing a PUT request. Returns a promise that will
   *  resolve in a Response object.
   *  @param    {string}    url     URL that points to the API endpoint.
   *  @param    {object}    data    Object containing the HTTP request
   *                                parameters.
   *  @returns  {Promise}
   */

  put = async (url = '', data = {}) => {
    // First, encode all files in the data as we can only send over strings in
    // JSON format.
    return this._encodeFiles(data).then(encoded => {
      // Use fetch to perform the HTTP request.
      return fetch(this._apiUrl + url, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('jwt')
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(encoded)
      });
    });
  };
  /**
   *  Method for performing a POST request. Returns a promise that will
   *  resolve in a Response object.
   *  @param    {string}    url     URL that points to the API endpoint.
   *  @param    {object}    data    Object containing the HTTP request
   *                                parameters.
   *  @returns  {Promise}
   */

  post = async (url = '', data = {}) => {
    // First, encode all files in the data as we can only send over strings in
    // JSON format.
    return this._encodeFiles(data).then(encoded => {
      // Use fetch to perform the HTTP request.
      return fetch(this._apiUrl + url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('jwt')
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(encoded)
      });
    });
  };
  /**
   *  Method for performing a DELETE request. Returns a promise that will
   *  resolve in a Response object.
   *  @param    {string}    url     URL that points to the API endpoint.
   *  @returns  {Promise}
   */

  delete = async (url = '') => {
    // Use fetch to perform the HTTP request.
    return fetch(this._apiUrl + url, {
      method: 'DELETE',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('jwt')
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    });
  };
  /**
   *  Private helper method to go through an object's entries and encode all
   *  files in the object.
   *  @param    {Object}    object    The object that might contain file
   *                                  entries.
   *  @returns  {Promise}
   */

  _encodeFiles = async object => {
    // Return a promise that resolves into the encoded object.
    return new Promise((resolve, reject) => {
      // Encoding files might fail.
      try {
        // We want to start a new object.
        const encoded = {}; // Gather an array of promises for encoding files.

        const promises = []; // Loop through all the object entries to build the new object.

        for (const [key, value] of Object.entries(object)) {
          // If the input value is a file, we want to encode it as a base64
          // string that we can send along in an HTTP request.
          if (value instanceof File) {
            // Store the promise for encoding this file.
            promises.push(this._encodeFile(value).then(dataObject => {
              encoded[key] = dataObject;
            })); // Otherwise, we can use it as is.
          } else encoded[key] = value;
        } // Return the new object we built after all files have been encoded.


        Promise.all(promises).then(() => void resolve(encoded)); // Reject the promise if any errors occur.
      } catch (error) {
        reject(error);
      }
    });
  };
  /**
   *  Private helper method to encode files using base64.
   *  @param    {File}      file    The file to encode.
   *  @return   {Promise}
   */

  _encodeFile = async file => {
    // Return a Promise that resolves into the data string.
    return new Promise((resolve, reject) => {
      // Get a file reader object that to read our file.
      const reader = new FileReader(); // Install an event listener to return the encoded file object as soon as
      // the file has been read successfully.

      reader.onload = () => void resolve({
        // Add the base64 encoded file property.
        file: reader.result,
        // Also add the extension from the file name.
        extension: file.name.split('.').pop()
      }); // Install event listeners to listen for when we fail to read the file.


      reader.onerror = error => void reject(error);

      reader.onabort = abort => void reject(abort); // Now read the file as a data URL.


      reader.readAsDataURL(file);
    });
  };
  /**
   *  There is nothing to remove here, but this method is expected on every
   *  class as the inner workings of this class is assumed to be unknown.
   */

  remove() {}

} // Export the Request class so it can be imported elsewhere.


export { Request };