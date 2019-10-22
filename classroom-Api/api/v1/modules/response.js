/**
 * A module that sends a JSON respone to the client.
 * @param  {object}   req  Request object
 * @param  {object}   res  Response object
 * @param  {Function} next Callback function to move on to the next middleware
 */
module.exports = (req, res, next) => {
    res.json(res.locals);
};
