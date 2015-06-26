var db = require('monk')(process.env.MONGO_URI);
module.exports = db;
