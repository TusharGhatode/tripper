const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://Tushar:wM40DmQANLs5og8G@cluster0.64s2o.mongodb.net/practise')
  .then(() => console.log("Connected!"))
  .catch((err) => console.log("error hai "));


