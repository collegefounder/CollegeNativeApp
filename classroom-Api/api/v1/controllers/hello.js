const log = require('winston');

module.exports = {
    /**
     * A sample controller to demonstarte our architecture
     * @param  {Function} callback JavaScript callback
     */
    world: (callback) => {
        log.info('Hello Controller');
        try {
            // Uncomment for sample error
            //throw new Error('Internal Server Error');

            let result = 'hello world';
            callback(null, result);
        } catch (error) {
            log.error('Hello Controller failed', error);
            callback(error);
        }
    }
};
