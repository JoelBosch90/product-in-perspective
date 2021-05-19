// Import settings.
import { CONFIG } from "/javascript/config.js";
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
  _apiUrl = CONFIG.apiUrl;
  /**
   *  Class constructor.
   */

  constructor() {}
  /**
   *  Method for performing a PUT request. Returns a promise that will
   *  resolve in a Response object.
   *  @param    {string}    url     URL that points to the API endpoint.
   *  @returns  {Promise}
   */


  get = async (url = '') => {
    // Use fetch to perform the HTTP request.
    const response = await fetch(this._apiUrl + url, {
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
    }); // Return the response.

    return response;
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
    // Use fetch to perform the HTTP request.
    const response = await fetch(this._apiUrl + url, {
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
      body: JSON.stringify(data)
    }); // Return the response.

    return response;
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
    // Get a FormData object.
    const formData = new FormData(data);
    console.log(formData); // Use fetch to perform the HTTP request.

    const response = await fetch(this._apiUrl + url, {
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
      body: JSON.stringify(data)
    }); // @TODO Remove previous code for reference.
    // // Use fetch to perform the HTTP request.
    // const response = await fetch(this._apiUrl + url, {
    //   method:         'POST',
    //   mode:           'cors',
    //   cache:          'no-cache',
    //   credentials:    'omit',
    //   headers:      {
    //     'Content-Type':   'application/json',
    //     'x-access-token': localStorage.getItem('jwt'),
    //   },
    //   redirect:       'follow',
    //   referrerPolicy: 'no-referrer',
    //   body:           JSON.stringify(data),
    // });
    // Return the response.

    return response;
  };
  /**
   *  Method for performing a DELETE request. Returns a promise that will
   *  resolve in a Response object.
   *  @param    {string}    url     URL that points to the API endpoint.
   *  @returns  {Promise}
   */

  delete = async (url = '') => {
    // Use fetch to perform the HTTP request.
    const response = await fetch(this._apiUrl + url, {
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
    }); // Return the response.

    return response;
  };
  /**
   *  There is nothing to remove here, but this method is expected on every
   *  class as the inner workings of this class is assumed to be unknown.
   */

  remove() {}

} // Export the Request class so it can be imported elsewhere.


export { Request };