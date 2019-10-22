const log = require('winston');
var ctrls = require('../controllers');

/**
 * A sample module to demonstrate our architecture
 * @param  {object}   req  Request object
 * @param  {object}   res  Response object
 * @param  {Function} next Callback function to move on to the next middleware
 */
module.exports = (req, res, next) => {
    log.info('Hello Module');
    ctrls.hello.world(function(err, result) {
        if (err) {
            let err = new Error('Oops something went wrong');
            err.status = 500;
            next(err);
            return;
        }

        res.locals.hello = {
            text: result
        };
        next();
    });
};
