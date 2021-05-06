var configValues = require('./config');

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || 27017
const DB_NAME = process.env.DB_NAME || 'mean-first-app'


module.exports = {
  getDbConnectionString: function () {
    return 'mongodb://' + configValues.uname + ':' + configValues.pwd
      + '@' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME;
  }
}
