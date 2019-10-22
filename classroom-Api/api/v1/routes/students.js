const log = require('winston');
var modules = require('../modules');
var config = require('../../../config');

/**
 * Routes for /students endpoints
 * @param  {object} router ExpressJS Router
 */
module.exports = (router) => {
    log.info('Initializing Route POST /students');
    router.post('/students',
        modules.verify.body,
        modules.students.validateCreate,
        modules.students.create,
        modules.response);

    // This route should be disabled in production
    if (config.mode !== 'PROD') {
        log.info('Initializing Route GET /students');
        router.get('/students',
            modules.students.getAll,
            modules.response);
    }

    log.info('Initializing Route GET /students/:id');
    router.get('/students/:id',
        modules.verify.token,
        modules.verify.params,
        modules.students.validatePathId,
        modules.students.verifyId,
        modules.students.getOne,
        modules.response);

    log.info('Initializing Route DELETE /students/:id');
    router.delete('/students/:id',
        modules.verify.token,
        modules.verify.params,
        modules.students.validatePathId,
        modules.students.verifyId,
        modules.students.deleteOne,
        modules.response);

    log.info('Initializing Route POST /students/goals');
    router.post('/students/goals',
        modules.verify.body,
        modules.students.createGoals,
        modules.response);

    log.info('Initializing Route POST /students/:id/goals');
    router.post('/students/:id/goals',
        modules.verify.token,
        modules.verify.body,
        modules.verify.params,
        modules.students.validatePathId,
        modules.students.verifyId,
        modules.students.validateGoal,
        modules.students.createGoal,
        modules.response);

    log.info('Initializing Route POST /students/:goalId/goals/:id');
    router.post('/students/:id/goals/:goalId/activityLogs',
        modules.verify.token,
        modules.verify.body,
        modules.verify.params,
        modules.students.validatePathId,
        modules.students.validateGoalId,
        modules.students.verifyId,
        modules.students.valdiateActivityLog,
        modules.students.updateGoalActivityLog,
        modules.response);

    log.info('Initializing Route DELETE /students/:id/goals/:goalId');
    router.delete('/students/:id/goals/:goalId',
        modules.verify.token,
        modules.verify.params,
        modules.students.validatePathId,
        modules.students.validateGoalId,
        modules.students.verifyId,
        modules.students.deleteGoal,
        modules.response);

    log.info('Initializing Route POST /students/:id/quizzes/:quizId/results');
    router.post('/students/:id/quizzes',
        modules.verify.token,
        modules.verify.params,
        modules.verify.body,
        modules.students.validatePathId,
        modules.students.verifyId,
        modules.students.validateQuizData,
        modules.students.submitQuiz,
        modules.response);
};
