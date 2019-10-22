const log = require('winston');
var modules = require('../modules');
var config = require('../../../config');

/**
 * Routes for /classrooms endpoints
 * @param  {object} router ExpressJS Router
 */
module.exports = (router) => {
    log.info('Initializing Route POST /classrooms');
    router.post('/classrooms',
        modules.verify.body,
        modules.classrooms.validateCreate,
        modules.classrooms.create,
        modules.response);

    // This route should be disabled in production
    if (config.mode !== 'PROD') {
        log.info('Initializing Route GET /classrooms');
        router.get('/classrooms',
            modules.classrooms.getAll,
            modules.response);
    }

    log.info('Initializing Route GET /classrooms/:id');
    router.get('/classrooms/:id',
        modules.verify.token,
        modules.verify.params,
        modules.classrooms.validatePathId,
        modules.classrooms.verifyTeacherOrStudent,
        modules.classrooms.getOne,
        modules.response);

    log.info('Initializing Route DELETE /classrooms/:id');
    router.delete('/classrooms/:id',
        modules.verify.token,
        modules.verify.params,
        modules.classrooms.validatePathId,
        modules.classrooms.verifyTeacher,
        modules.classrooms.deleteOne,
        modules.response);

    log.info('Initializing Route POST /classrooms/:id/quizzes');
    router.post('/classrooms/:id/quizzes',
        modules.verify.token,
        modules.verify.body,
        modules.verify.params,
        modules.classrooms.validatePathId,
        modules.classrooms.verifyTeacher,
        modules.classrooms.validateQuizCreation,
        modules.classrooms.createQuiz,
        modules.response);

    log.info('Initializing Route GET /classrooms/:id/quizzes');
    router.get('/classrooms/:id/quizzes',
        modules.verify.token,
        modules.verify.params,
        modules.classrooms.validatePathId,
        modules.classrooms.verifyTeacherOrStudent,
        modules.classrooms.getAllQuizzes,
        modules.response);

    log.info('Initializing Route GET /classrooms/:id/quizzes/activated');
    router.get('/classrooms/:id/quizzes/activated',
        modules.verify.token,
        modules.verify.params,
        modules.classrooms.validatePathId,
        modules.classrooms.verifyTeacherOrStudent,
        modules.classrooms.getAllActiveQuizzes,
        modules.response);

    // Starts and creates an attendance
    log.info('Initializing Route POST /classrooms/:id/attendances');
    router.post('/classrooms/:id/attendances',
        modules.verify.token,
        modules.verify.params,
        modules.classrooms.validatePathId,
        modules.classrooms.verifyTeacher,
        modules.classrooms.validateAttendanceCreation,
        modules.classrooms.createAttendance,
        modules.response);

    // Stops an attendance
    log.info('Initializing Route POST /classrooms/:id/attendances/:attendanceId/stop');
    router.post('/classrooms/:id/attendances/:attendanceId/stop',
        modules.verify.token,
        modules.verify.params,
        modules.classrooms.validatePathId,
        //modules.classrooms.validateAttendanceId,
        // TODO: validate attendance id
        modules.classrooms.verifyTeacher,
        modules.classrooms.stopAttendance,
        modules.response);

    // Starts an attendance
    log.info('Initializing Route POST /classrooms/:id/attendances/:attendanceId/start');
    router.post('/classrooms/:id/attendances/:attendanceId/start',
        modules.verify.token,
        modules.verify.params,
        modules.classrooms.validatePathId,
        //modules.classrooms.validateAttendanceId,
        // TODO: validate attendance id
        modules.classrooms.verifyTeacher,
        modules.classrooms.startAttendance,
        modules.response);

    log.info('Initializing Route GET /classrooms/:id/attendances');
    router.get('/classrooms/:id/attendances',
        modules.verify.token,
        modules.verify.params,
        modules.classrooms.validatePathId,
        modules.classrooms.verifyTeacherOrStudent,
        modules.classrooms.getAllAttendances,
        modules.response);

    log.info('Initializing Route GET /classrooms/:id/students/:studentId/signIn');
    router.post('/classrooms/:id/students/:studentId/signIn',
        modules.verify.token,
        modules.verify.params,
        modules.classrooms.validatePathId,
        //TODO: verify and validate Student Id
        modules.classrooms.studentSignIn,
        modules.response);

    log.info('Initializing Route GET /classrooms/:id/students');
    router.get('/classrooms/:id/students',
        modules.verify.token,
        modules.verify.params,
        modules.classrooms.validatePathId,
        modules.classrooms.verifyTeacher,
        modules.classrooms.getAllStudents,
        modules.response);
};
