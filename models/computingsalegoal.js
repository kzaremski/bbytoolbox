/*
  Computing Department Sale Goal Mongoose Model/Schema
*/

// Mongoose package & schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ComputingSaleGoalSchema = new Schema({
  date: String,
  modified: Array,
  units: {
    oem: Number,
    office: Number,
    surface: Number,
    tts: Number,
    bp: Number
  }
});

module.exports = mongoose.model('computingsalegoal', ComputingSaleGoalSchema);