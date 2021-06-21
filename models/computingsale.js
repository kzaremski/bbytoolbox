/*
  IP Address Mongoose Model/Schema
*/

// Mongoose package & schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ComputingSaleSchema = new Schema({
  date: String,
  employee: {
    name: String,
    number: String
  },
  units: {
    oem: 0,
    office: 0,
    surface: 0,
    tts: 0,
    bp: 0
  }
});

module.exports = mongoose.model('ipaddress', ComputingSaleSchema);