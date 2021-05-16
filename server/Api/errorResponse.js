/**
 *  Helper function that returns a proper error response.
 *  @param    {ServerResponse}  response  The server response.
 *  @param    {number}          status    The number indicating the response
 *                                        status.
 *  @param    {string}          error     The error message.
 *  @returns  {ServerResponse}
 */
module.exports = errorResponse = (response, status, error) => {

  // Did we not get an error message or error object? Throw a general error.
  if (!error) return response.status(500).json({ error: "Unknown error occurred." });

  // If we got a simple string error message, we can just pass that to the
  // client.
  if (typeof error == "string") return response.status(status).json({ error });

  // If MongoDB could not match the object id, it means the requested object
  // could not be found.
  if (error.kind == "ObjectId") return response.status(404).json({ error: "Could not find object." });

  // If the error object is something we don't recognize, we shouldn't leak it
  // to the client.
  return response.status(500).json({ error: "Unknown error occurred." });
}