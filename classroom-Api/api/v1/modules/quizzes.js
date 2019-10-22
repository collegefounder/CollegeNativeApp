const log = require('winston');
var ctrls = require('../controllers');
var models = require('../models');

module.exports = {
    /**
     * Gets all quizzes
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with array of all quiz documents
     */
    getAll: (req, res, next) => {
        log.info('Module - GetAll Quizzes');
        ctrls.mongodb.find(models.quizzes, {}, (err, results) => {
            if (err) {
                let err = new Error('Failed getting all quizzes!');
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found all quizzes.');
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
        log.info('Module - validatePathId Quiz');

        log.info('Validating request...');
        if (!req.params.id) {
            log.error('Request validation failed');
            let err = new Error('Missing required id parameter in the request path.');
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
     * Gets a quiz
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with quiz document
     */
    getOne: (req, res, next) => {
        log.info('Module - GetOne Quiz');
        ctrls.mongodb.findById(models.quizzes, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed getting quiz: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found quiz [' + req.params.id + ']');
            res.locals = result;
            next();
        });
    },
    /**
     * Deletes a quiz
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with deletion result
     */
    deleteOne: (req, res, next) => {
        log.info('Module - DeleteOne Quiz');
        ctrls.mongodb.findByIdAndRemove(models.quizzes, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed deleting quiz: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully deleted quiz [' + req.params.id + ']');
            res.locals = result;
            next();
        });
    },
    /**
     * Starts a quiz
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    startQuiz: (req, res, next) => {
        log.info('Module - startQuiz Quiz');
        ctrls.mongodb.findById(models.quizzes, req.params.id, (err, quiz) => {
            if (err) {
                let err = new Error('Failed getting quiz: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found quiz [' + req.params.id + ']');
            quiz.activated = true;
            res.locals = quiz;
            ctrls.mongodb.save(quiz, (err, _result) => {
                if (err) {
                    let err = new Error('Failed Activating Quiz!');
                    err.status = 500;
                    next(err);
                    return;
                }

                log.info('Succesfully activated quiz [' + req.params.id + ']');
                next();
            });
        });
    },
    /**
     * Stops a quiz
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    stopQuiz: (req, res, next) => {
        log.info('Module - stopQuiz Quiz');
        ctrls.mongodb.findById(models.quizzes, req.params.id, (err, quiz) => {
            if (err) {
                let err = new Error('Failed getting quiz: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found quiz [' + req.params.id + ']');
            quiz.activated = false;
            res.locals = quiz;
            ctrls.mongodb.save(quiz, (err, _result) => {
                if (err) {
                    let err = new Error('Failed stoping Quiz!');
                    err.status = 500;
                    next(err);
                    return;
                }

                log.info('Succesfully stopped quiz [' + req.params.id + ']');
                next();
            });
        });
    }
};
