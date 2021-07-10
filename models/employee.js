/*
  Employee/User Mongoose Model/Schema
*/

// Mongoose package & schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EmployeeSchema = new Schema({
  number: String,
  name: String,
  pin: String,
  store: String,
  defaultstore: String,
  admin: Boolean,
  disabled: Boolean
});

module.exports = mongoose.model('employees', EmployeeSchema);