const log = require('winston');
var modules = require('../modules');

/**
 * Routes for /quizzes endpoints
 * @param  {object} router ExpressJS Router
 */
module.exports = (router) => {
    log.info('Initializing Route GET /quizzes');
    router.get('/quizzes',
        modules.quizzes.getAll,
        modules.response);

    log.info('Initializing Route GET /quizzes/:id');
    router.get('/quizzes/:id',
        modules.verify.params,
        modules.quizzes.validatePathId,
        modules.quizzes.getOne,
        modules.response);

    log.info('Initializing Route DELETE /quizzes/:id');
    router.delete('/quizzes/:id',
        modules.verify.params,
        modules.quizzes.validatePathId,
        modules.quizzes.deleteOne,
        modules.response);

    log.info('Initializing Route DELETE /quizzes/:id/start');
    router.post('/quizzes/:id/start',
        modules.verify.params,
        modules.quizzes.validatePathId,
        modules.quizzes.startQuiz,
        modules.response);

    log.info('Initializing Route DELETE /quizzes/:id/stop');
    router.post('/quizzes/:id/stop',
        modules.verify.params,
        modules.quizzes.validatePathId,
        modules.quizzes.stopQuiz,
        modules.response);
};
