const log = require('winston');
var modules = require('../modules');

/**
 * Routes for /teachers endpoints
 * @param  {object} router ExpressJS Router
 */
module.exports = (router) => {
    log.info('Initializing Route POST /authenticate');
    router.post('/authenticate',
        modules.verify.body,
        modules.authenticate.giveToken,
        modules.response);
};
