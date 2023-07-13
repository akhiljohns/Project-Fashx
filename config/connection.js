const dotenv = require('dotenv');
dotenv.config()
const mongoose = require('mongoose');
const mongoconn = process.env.MONGODB_SERVER

module.exports.connect = function(){

mongoose.connect(mongoconn, { dbName: 'fashx' })
  .then(() => {
    console.log('Connected to Database');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

}
