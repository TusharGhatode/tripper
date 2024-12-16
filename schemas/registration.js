const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registration = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  }});



const registrationSchema = mongoose.model('Userlogins', registration);
module.exports = registrationSchema;
