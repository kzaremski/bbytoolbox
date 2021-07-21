/*
  System Setting Mongoose Model/Schema
*/

// Mongoose package & schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SettingSchema = new Schema({
  name: String,
  value: Mixed
});

module.exports = mongoose.model('settings', SettingSchema);