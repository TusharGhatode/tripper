const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true, 
  },
  number: {
    type: String,
    required: true, 
  },
  travelers: {
    type: String,
    required: true, 
  },
  place: {
    type: String,
    required: true, 
  },
  location: {
    type: String,
    required: true, 
  },
  userId: {
    type: String,
    required: true, 
  },
  clientId: {
    type: String,
    required: true, 
  },
 
});



const FormData = mongoose.model('bookings', formDataSchema);

module.exports = FormData;
