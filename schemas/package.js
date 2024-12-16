const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  place: { type: String, required: true },
  price: { type: Number, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true },  // Make sure this matches the field you're updating
  location: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
});



const FormData = mongoose.model('packages', formDataSchema);

module.exports = FormData;
