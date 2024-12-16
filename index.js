const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const registration = require('./routes/registration')
const package = require("./routes/package")
const path = require("path");

require('dotenv').config(); 
const PORT = 8080;
const app = express();
require('./config/db')


app.use(cors({
    origin: 'https://placefind.netlify.app',
    methods: ['GET', 'POST', 'PATCH', 'DELETE','PUT'],
    credentials: true,
    
}))





app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(registration)
app.use(package)







app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
