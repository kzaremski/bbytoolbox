/*
  Computing Sale Report Mongoose Schema
*/

// Mongoose package & schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ReportSchema = new Schema({
  guid: String,
  date: Date,
  filename: String,
  format: String,
  data: String,
});

module.exports = mongoose.model('reports', ReportSchema);