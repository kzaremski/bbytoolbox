/*
  Computing Sale Mongoose Model/Schema
*/

// Mongoose package & schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ComputingSaleSchema = new Schema({
  date: Date,
  timezone: String,
  employee: {
    name: String,
    number: String
  },
  units: {
    oem: Number,
    office: Number,
    surface: Number,
    tts: Number,
    bp: Number
  }
});

module.exports = mongoose.model('computingsale', ComputingSaleSchema);