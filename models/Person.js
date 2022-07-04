const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
  },
  profilepic: {
    type: String,
    default: "../models/public/images/default-men.jpg"
  }
}, { timestamps: true });

module.exports = Person = mongoose.model("myPerson", PersonSchema);