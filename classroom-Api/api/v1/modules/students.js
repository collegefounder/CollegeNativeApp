const log = require('winston');
const bcrypt = require('bcrypt')
var ctrls = require('../controllers');
var models = require('../models');

module.exports = {
    /**
     * Validates schema before creating a student
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validateCreate: (req, res, next) => {
        log.info('Module - ValidateCreate Student');

        // Validate schema
        log.info('Validating student model...')
        var student = new models.students(req.body);
        var error = student.validateSync();

        if (error) {
            log.error('Student model validation failed!');
            let err = new Error('Student Validation Failed!');
            err.status = 400;
            // Remove stack trace but retain detailed description of validation errors
            err.data = JSON.parse(JSON.stringify(error));
            next(err);
            return;
        }

        log.info('Student model has been validated!');
        next();
    },
    /**
     * Creates a student
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with newly created student document
     */
    create: (req, res, next) => {
        log.info('Module - Create Student');

        var student = new models.students(req.body);
        // Hash Password
        var saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(error, salt) {
            bcrypt.hash(req.body.password, salt, function(error, hash) {
                student.password = hash;
                ctrls.mongodb.save(student, (error, result) => {
                    if (error) {
                        let err = new Error('Failed creating student!');
                        err.status = 500;
                        next(err);
                        return;
                    }
                    log.info('Successfully created student.');
                    res.locals = JSON.parse(JSON.stringify(result));
                    delete res.locals['password'];
                    next();
                });
            });
        });

    },
    /**
     * Gets all students
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with array of all students documents
     */
    getAll: (req, res, next) => {
        log.info('Module - GetAll Students');
        ctrls.mongodb.find(models.students, {}, (err, results) => {
            if (err) {
                let err = new Error('Failed getting all students!');
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found all students.');
            res.locals = results;
            next();
        });
    },
    /**
     * Validates path id parameter
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validatePathId: (req, res, next) => {
        log.info('Module - validatePathId Student');

        log.info('Validating request...');
        if (!req.params.id) {
            log.error('Request validation failed');
            let err = new Error('Missing required id parameter in the request path. (/students/:id)');
            err.status = 400;
            next(err);
            return;
        }

        if (!ctrls.mongodb.isObjectId(req.params.id)) {
            log.error('Request validation failed');
            let err = new Error('Invalid id parameter in the request path.');
            err.status = 400;
            next(err);
            return;
        }

        log.info('Request validated!');
        next();
    },
    /**
     * Gets a student
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with student document
     */
    getOne: (req, res, next) => {
        log.info('Module - GetOne Student');
        let populators = [{
            path: 'classrooms'
        }];
        ctrls.mongodb.findByIdAndPopulate(models.students, req.params.id, populators, (err, result) => {
            if (err) {
                let err = new Error('Failed getting student: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found student [' + req.params.id + ']');
            res.locals = result;
            next();
        });
    },
    /**
     * Deletes a student
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with deletion result
     */
    deleteOne: (req, res, next) => {
        log.info('Module - DeleteOne Student');
        ctrls.mongodb.findByIdAndRemove(models.students, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed deleting student: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully deleted student [' + req.params.id + ']');
            res.locals = result;
            next();
        });
    },
    /**
     * Validates a goal for a student
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validateGoal: (req, res, next) => {
        log.info('Module - ValidateGoal Student');

        // Validate schema
        log.info('Validating student goal...');
        let fakeStudent = new models.students({
            goals: [req.body]
        });

        let student = new models.students(fakeStudent);
        let error = student.validateSync();

        if (error.errors['goals']) {
            log.error('Student goal validation failed!');
            let err = new Error('Student Goal Validation Failed!');
            err.status = 400;
            // Remove stack trace but retain detailed description of validation errors
            err.data = JSON.parse(JSON.stringify(error.errors['goals']));
            next(err);
            return;
        }

        log.info('Student goal has been validated!');
        next();
    },
    /**
     * Creates a goal for a student
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with student model
     */
    createGoal: (req, res, next) => {
        log.info('Module - CreateGoal Student');
        ctrls.mongodb.findById(models.students, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed getting student!');
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found student [' + req.params.id + ']');

            log.info('Creating student goal');
            result.goals.push(req.body);

            ctrls.mongodb.save(result, (err, _result) => {
                if (err) {
                    let err = new Error('Failed creating student goal!');
                    err.status = 500;
                    next(err);
                    return;
                }

                log.info('Successfully created goal for student [' + req.params.id + ']');

                res.locals = _result;
                next();
            });
        });
    },
    /**
     * Validates a goal id
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validateGoalId: (req, res, next) => {
        log.info('Module - ValidateGoalId Student');

        log.info('Validating goalId...');
        if (!req.params.goalId) {
            log.error('Goal ID validation failed');
            let err = new Error('Missing required goal id parameter in the request path.');
            err.status = 400;
            next(err);
            return;
        }

        if (!ctrls.mongodb.isObjectId(req.params.goalId)) {
            log.error('goalId validation failed');
            let err = new Error('Invalid goal id parameter in the request path.');
            err.status = 400;
            next(err);
            return;
        }
        log.info('goalId has been validated!');
        next();
    },
    /**
     * Validates an activity log entry for a student goal
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    valdiateActivityLog: (req, res, next) => {
        log.info('Module - ValdiateActivityLog Student');

        // Validate schema
        log.info('Validating student goal...');
        let fakeStudent = new models.students({
            goals: [{
                title: 'fake',
                activityLog: [req.body]
            }]
        });

        let student = new models.students(fakeStudent);
        let error = student.validateSync();

        // TODO: potentially change this as it may be confusing to consumer
        if (error.errors['goals'] && error.errors['goals']['errors']) {
            log.error('Student goal activity log validation failed!');
            let err = new Error('Student Goal Activity Log Validation Failed!');
            err.status = 400;
            // Remove stack trace but retain detailed description of validation errors
            for (var obj in error.errors['goals']['errors']) {
                err.data = JSON.parse(JSON.stringify(error.errors['goals']['errors'][obj]));
                break;
            }
            next(err);
            return;
        }

        log.info('Student goal activity log has been validated!');
        next();
    },
    /**
     * Updates a student's goal's activity log
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with student model
     */
    updateGoalActivityLog: (req, res, next) => {
        log.info('Module - UpdateGoalActivityLog Student');
        ctrls.mongodb.findById(models.students, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed getting student!');
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found student [' + req.params.id + ']');

            // TODO: Optimize the search?
            log.info('Searching for student goal [' + req.params.goalId + ']');
            for (let i = 0; i < result.goals.length; i++) {
                // Safe comparison of mongo DB ids
                if (String(result.goals[i]._id) === String(req.params.goalId)) {
                    // Re-calculate mark
                    let mark = req.body.mark * req.body.weight;
                    for (let j = 0; j < result.goals[i].activityLog.length; j++) {
                        mark += result.goals[i].activityLog[j].mark * result.goals[i].activityLog[j].weight;
                    }

                    // Update activity log
                    log.info('Updating student goal [' + req.params.goalId + '] with activity log entry');
                    result.goals[i].activityLog.push(req.body);

                    // Update goal mark
                    log.info('Updating goal progress');
                    result.goals[i].mark = mark;
                    break;
                }
            }

            ctrls.mongodb.save(result, (err, _result) => {
                if (err) {
                    let err = new Error('Failed updating student goal activity log!');
                    err.status = 500;
                    next(err);
                    return;
                }

                log.info('Successfully updated student goal activity log for student [' + req.params.id + ']');

                res.locals = _result;
                next();
            });
        });
    },
    /**
     * Deletes a students goal
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with deleted goal
     */
    deleteGoal: (req, res, next) => {
        log.info('Module - DeleteGoal Student');
        ctrls.mongodb.findById(models.students, req.params.id, (err, student) => {
            if (err) {
                let err = new Error('Failed getting student: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found student [' + req.params.id + ']');

            // Linear search TODO: optimize
            log.info('Searching student for goal [' + req.params.goalId + ']');
            let found = false;
            for (let i = 0; i < student.goals; i++) {
                if (ctrls.mongodb.isEqual(student.goals[i].goal, req.params.goalId)) {
                    found = true;
                    log.info('Found student goal [' + req.params.goalId + ']');
                    res.locals = student.goals[i];
                    log.info('Removing student goal [' + req.params.goalId + ']');
                    student.goals.splice(i, 1);
                    break;
                }
            }

            if (!found) {
                let err = new Error('Goal not found: ' + req.params.goalId);
                err.status = 404;
                next(err);
                return;
            }

            next();
        });
    },
    /**
     * Verifies the identity of a student based on JWT
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    verifyId: (req, res, next) => {
        log.info('Module - verifyId Student');
        if (!req.auth) {
            log.error('Missing req.auth decoded token');
            let err = new Error('Invalid Token for authentication, forbidden');
            err.status = 403;
            next(err);
            return;
        }

        if (req.auth.type === 'teacher') {
            log.info('Teacher authenticated, access granted');
            next();
            return;
        }

        if (req.auth.type !== 'student') {
            log.error('Unkown user type');
            let err = new Error('Invalid Token for authentication');
            err.status = 401;
            next(err);
            return;
        }

        if (!ctrls.mongodb.isObjectId(req.auth.id)) {
            log.error('Token id is not a valid Mongo DB id');
            let err = new Error('Invalid Token for authentication');
            err.status = 401;
            next(err);
            return;
        }

        if (!ctrls.mongodb.isEqual(req.auth.id, req.params.id)) {
            log.error('User is unauthorized to access this data.');
            let err = new Error('Unauthorized');
            err.status = 401;
            next(err);
            return;
        }

        log.info('Authorized');
        next();
    },

    /**
     * Validates a quiz payload for a student
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validateQuizData: (req, res, next) => {
        log.info('Module - validateQuizData Student');

        // Validate schema
        log.info('Validating student quiz data...');
        let fakeStudent = new models.students({
            quizHistory: [req.body]
        });

        let student = new models.students(fakeStudent);
        let error = student.validateSync();

        if (error.errors['quizHistory']) {
            log.error('Student quiz data validation failed!');
            let err = new Error('Student Quiz Data Validation Failed!');
            err.status = 400;
            // Remove stack trace but retain detailed description of validation errors
            err.data = JSON.parse(JSON.stringify(error.errors['quizHistory']));
            next(err);
            return;
        }

        log.info('Student quiz data has been validated!');
        next();
    },

    /**
     * Submits a quiz
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    submitQuiz: (req, res, next) => {
        log.info('Module - submitQuiz Student');
        ctrls.mongodb.findById(models.students, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed getting student!');
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found student [' + req.params.id + ']');

            log.info('Submitting student quiz');
            result.quizHistory.push(req.body);

            ctrls.mongodb.save(result, (err, _result) => {
                if (err) {
                    let err = new Error('Failed submitting student quiz!');
                    err.status = 500;
                    next(err);
                    return;
                }

                log.info('Successfully submitted quiz for student [' + req.params.id + ']');

                res.locals = _result;
                next();
            });
        });
    },
    /**
     * Assigns goals to a list of students
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    createGoals: (req, res, next) => {
        log.info('Module - createGoals Student');
        for (let i = 0; i < req.body.students.length; i++) {
            ctrls.mongodb.findById(models.students, req.body.students[i], (err, result) => {
                if (err) {
                    log.error('Failed creating goal for student');
                    return;
                }
                log.info('Successfully found student [' + result._id + ']');

                log.info('Creating student goal');
                result.goals.push(req.body.goal);

                ctrls.mongodb.save(result, (err, _result) => {
                    if (err) {
                        log.error('Failed creating goal for student [' + result._id + ']');
                        return;
                    }
                    log.info('Successfully created goal for student [' + result._id + ']');
                });
            });
        }
        res.locals = {
            accepted: true
        };
        next();
    }
};
