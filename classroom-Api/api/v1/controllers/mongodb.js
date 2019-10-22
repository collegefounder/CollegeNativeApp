const log = require('winston');
const mongoose = require('mongoose');

module.exports = {
    /**
     * Checks if two non null object ids are equal
     * @param  {string|object}  id1 First Mongo DB id
     * @param  {string|object}  id2 Second Mongo DB id
     * @return {Boolean}     true if ids are equal
     */
    isEqual: (id1, id2) => {
        id1 = (typeof id1 === 'string') ? new mongoose.Types.ObjectId(id1) : id1;
        id2 = (typeof id2 === 'string') ? new mongoose.Types.ObjectId(id2) : id2;
        return id1.equals(id2);
    },
    /**
     * Checks if id is a valid Mongo DB _id
     * @param  {String}  id ID string
     * @return {Boolean}    true/false depending on weither or not the id is valid
     */
    isObjectId: (id) => {
        return mongoose.Types.ObjectId.isValid(id);
    },
    /**
     * Finds one document in Mongo DB based on _id and deletes it
     * @param  {object}   model    Mongoose Model
     * @param  {String}   id       Mongo DB id
     * @param  {Function} callback JavaScript Callback
     */
    findByIdAndRemove: (model, id, callback) => {
        try {
            log.info('[findOneAndRemove] Searching Mongo DB for ' + id);
            model.findByIdAndRemove(id).exec((err, result) => {
                if (err) {
                    // Catches Mongo DB errors
                    log.error('[findByIdAndRemove] Mongo DB failed!', err);
                    callback(err);
                    return;
                }
                log.info('[findByIdAndRemove] Finished searching Mongo DB.');
                log.debug(result);
                callback(null, result);
            });
        } catch (error) {
            // Catches execution errors
            log.error('Mongoose execution of [findByIdAndRemove] failed', error);
            callback(error);
        }
    },
    /**
     * Finds one document in Mongo DB based on _id and deletes it
     * @param  {object}   model    Mongoose Model
     * @param  {object}   criteria Search criteria
     * @param  {Function} callback JavaScript Callback
     */
    findOneAndRemove: (model, criteria, callback) => {
        try {
            log.info('[findOneAndRemove] Searching Mongo DB for ' + id);
            model.findOneAndRemove(criteria).exec((err, result) => {
                if (err) {
                    // Catches Mongo DB errors
                    log.error('[findOneAndRemove] Mongo DB failed!', err);
                    callback(err);
                    return;
                }
                log.info('[findOneAndRemove] Finished searching Mongo DB.');
                log.debug(result);
                callback(null, result);
            });
        } catch (error) {
            // Catches execution errors
            log.error('Mongoose execution of [findOneAndRemove] failed', error);
            callback(error);
        }
    },
    /**
     * Finds one document in Mongo DB based on _id
     * @param  {object}   model    Mongoose Model
     * @param  {String}   id       Mongo DB id
     * @param  {Function} callback JavaScript Callback
     */
    findById: (model, id, callback) => {
        try {
            log.info('[findByID] Searching Mongo DB for ' + id);
            model.findById(id).exec((err, result) => {
                if (err) {
                    // Catches Mongo DB errors
                    log.error('Mongo DB findByID failed!', err);
                    callback(err);
                    return;
                }
                log.info('[findByID] Finished searching Mongo DB.');
                log.debug(result);
                callback(null, result);
            });
        } catch (error) {
            // Catches execution errors
            log.error('Mongoose execution of [findByID] failed', error);
            callback(error);
        }
    },
    /**
     * Finds one document in Mongo DB based on _id and populates sub fields
     * @param  {object}   model    Mongoose Model
     * @param  {String}   id       Mongo DB id
     * @param  {Array}   populate  Array of fields to populate [{path: 'field'}]
     * @param  {Function} callback JavaScript Callback
     */
    findByIdAndPopulate: (model, id, populate, callback) => {
        try {
            log.info('[findByID] Searching Mongo DB for ' + id);
            model.findById(id).populate(populate).exec((err, result) => {
                if (err) {
                    // Catches Mongo DB errors
                    log.error('Mongo DB findByID failed!', err);
                    callback(err);
                    return;
                }
                log.info('[findByID] Finished searching Mongo DB.');
                log.debug(result);
                callback(null, result);
            });
        } catch (error) {
            // Catches execution errors
            log.error('Mongoose execution of [findByID] failed', error);
            callback(error);
        }
    },
    /**
     * Finds one document in Mongo DB
     * @param  {object}   model    Mongoose Model
     * @param  {object}   criteria Search criteria
     * @param  {Function} callback JavaScript Callback
     */
    findOne: (model, criteria, callback) => {
        try {
            log.info('[findOne] Searching Mongo DB');
            log.debug('Criteria:');
            log.debug(criteria);
            model.findOne(criteria).select('+password').exec((err, result) => {
                if (err) {
                    // Catches Mongo DB errors
                    log.error('Mongo DB findOne failed!', err);
                    callback(err);
                    return;
                }
                log.info('[findOne] Finished searching Mongo DB');
                log.debug(result);
                callback(null, result);
            });
        } catch (error) {
            // Catches execution errors
            log.error('Mongoose execution of [findOne] failed', error);
            callback(error);
        }
    },
    /**
     * Finds documents in Mongo DB
     * @param  {object}   model    Mongoose Model
     * @param  {object}   criteria Search criteria
     * @param  {Function} callback JavaScript Callback
     */
    find: (model, criteria, callback) => {
        try {
            log.info('[find] Searching Mongo DB');
            log.debug('Criteria:');
            log.debug(criteria);
            model.find(criteria).exec((err, results) => {
                if (err) {
                    // Catches Mongo DB errors
                    log.error('Mongo DB find failed!', err);
                    callback(err);
                    return;
                }
                log.info('[find] Finished searching Mongo DB');
                log.debug(results);
                callback(null, results);
            });
        } catch (error) {
            // Catches execution errors
            log.error('Mongoose execution of [find] failed', error);
            callback(error);
        }
    },
    /**
     * Saves a document to Mongo DB
     * @param  {object}   model    Mongoose Model
     * @param  {Function} callback JavaScript Callback
     */
    save: (model, callback) => {
        try {
            log.info('Saving document into Mongo DB');
            model.save((err, data) => {
                if (err) {
                    // Catches Mongo DB errors
                    log.error('Mongo DB save failed!', err);
                    callback(err);
                    return;
                }
                callback(null, data);
            });
        } catch (error) {
            // Catches execution errors
            log.error('Mongoose execution of [save] failed!', error);
            callback(error);
        }
    }
};
