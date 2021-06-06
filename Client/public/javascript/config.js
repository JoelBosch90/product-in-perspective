/**
 *  This is a special config file that supplies certain parts of the client side
 *  scripts with paramaters that might differ between the development and the
 *  production environment.
 */
// Let's claim this variable as the config namespace.
const CONFIG = {}; // Depending on the environment that we're running, we might want to call the
// API at a different url. This is the development API URL.

CONFIG.apiUrl = 'http://localhost:3000/api'; // Depending on the environment that we're running, we might want to call the
// storage at a different url. This is the development storage URL.

CONFIG.storageUrl = 'http://localhost:9000/models'; // Export the CONFIG namespace so it can be imported elsewhere.

export { CONFIG };