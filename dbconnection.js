const mongoose = require('mongoose');

const dbconnection = mongoose.connect('mongodb+srv://lukesh:lukesh123@cluster0.wqjfl.mongodb.net/database3', {});

module.exports = dbconnection