module.exports = {
    mode: 'DEV', // [DEV/PROD]
    log: 'smart-classroom-api.log',
    tokenSecret: '',
    dev: {
      port: 8080,
      host: 'localhost',
      protocol: 'http',
      database: {
        user: '',
        password: '',
        host: '',
        port: 0,
        name: ''
      }
    },
    prod: {
      port: 443,
      host: 'sample.com',
      protocol: 'https',
      database: {
        user: '',
        password: '',
        host: '',
        port: 0,
        name: ''
      }
    },
    api: {
      version: 'v1'
    }
};
