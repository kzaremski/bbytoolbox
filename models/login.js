/*
  Login/access record Mongoose Model/Schema
*/

// Mongoose package & schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LoginSchema = new Schema({
  ip: String,
  date: Date,
  employee: String
});

module.exports = mongoose.model('logins', LoginSchema);