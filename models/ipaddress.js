/*
  IP Address Mongoose Model/Schema
*/

// Mongoose package & schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let IPAddressSchema = new Schema({
  ipv4: String,
  ipv6: String,
  blacklist: Boolean,
  note: String
});

module.exports = mongoose.model('ipaddress', IPAddressSchema);