const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./routes/routes.js');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/jwtauth');

const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', user);

app.listen(PORT, function(){
   console.log('Server is running on Port',PORT);
});