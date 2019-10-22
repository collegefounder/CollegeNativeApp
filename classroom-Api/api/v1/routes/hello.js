const log = require('winston');
var modules = require('../modules');

/**
 * A sample route to demonstrate our architecture.
 * @param  {object} router ExpressJS Router
 */
module.exports = (router) => {
    log.info('Initializing Route GET /hello');

    // Router supports get, post, put, delete
    router.get('/hello',
        modules.hello,
        modules.response);
};
