const log = require('winston');
var modules = require('../modules');

/**
 * Routes for /goals endpoints
 * @param  {object} router ExpressJS Router
 */
module.exports = (router) => {
    log.info('Initializing Route POST /goals');
    router.post('/goals',
        modules.verify.token,
        modules.verify.body,
        modules.goals.validateCreate,
        modules.goals.create,
        modules.response);

    log.info('Initializing Route GET /goals');
    router.get('/goals',
        modules.verify.token,
        modules.goals.getAll,
        modules.response);

    log.info('Initializing Route GET /goals/:id');
    router.get('/goals/:id',
        modules.verify.token,
        modules.verify.params,
        modules.goals.validatePathId,
        modules.goals.getOne,
        modules.response);

    log.info('Initializing Route DELETE /goals/:id');
    router.delete('/goals/:id',
        modules.verify.token,
        modules.verify.params,
        modules.goals.validatePathId,
        modules.goals.deleteOne,
        modules.response);
};
