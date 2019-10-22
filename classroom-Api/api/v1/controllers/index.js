/**
 * This is the entry point of all the controllers in the API.
 * Controllers will execute code that does work and interfaces with extensions.
 *
 * Each controllers follows the JavaScript callback convention of error first.
 * The last input parameter of each controller must be a callback function.
 *
 * @type {Object}
 */
module.exports = {
    hello: require('./hello'),
    mongodb: require('./mongodb')
};
