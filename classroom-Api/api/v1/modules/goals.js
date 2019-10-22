const log = require('winston');
var ctrls = require('../controllers');
var models = require('../models');

module.exports = {
    /**
     * Validates schema before creating a goal
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validateCreate: (req, res, next) => {
        log.info('Module - ValidateCreate Goal');

        // Validate schema
        log.info('Validating goal model...')
        var goal = new models.goals(req.body);
        var error = goal.validateSync();

        if (error) {
            log.error('Goal model validation failed!');
            let err = new Error('Goal Validation Failed!');
            err.status = 400;
            // Remove stack trace but retain detailed description of validation errors
            err.data = JSON.parse(JSON.stringify(error));
            next(err);
            return;
        }

        log.info('Goal model has been validated!');
        next();
    },
    /**
     * Creates a goal
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with newly created goal document
     */
    create: (req, res, next) => {
        log.info('Module - Create Goal');
        var goal = new models.goals(req.body);
        ctrls.mongodb.save(goal, (err, result) => {
            if (err) {
                let err = new Error('Oops something went wrong!');
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully created goal');
            res.locals = result;
            next();
        });
    },
    /**
     * Gets all goals
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with array of all goal documents
     */
    getAll: (req, res, next) => {
        log.info('Module - GetAll Goals');
        ctrls.mongodb.find(models.goals, {}, (err, results) => {
            if (err) {
                let err = new Error('Failed getting all goals!');
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found all goals.');
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
        log.info('Module - validatePathId Goal');

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
     * Gets a goal
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with goal document
     */
    getOne: (req, res, next) => {
        log.info('Module - GetOne Goal');
        ctrls.mongodb.findById(models.goals, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed getting goal: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found goal [' + req.params.id + ']');
            res.locals = result;
            next();
        });
    },
    /**
     * Deletes a goal
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with deletion result
     */
    deleteOne: (req, res, next) => {
        log.info('Module - DeleteOne Goal');
        ctrls.mongodb.findByIdAndRemove(models.goals, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed deleting goal: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully deleted goal [' + req.params.id + ']');
            res.locals = result;
            next();
        });
    },
};
