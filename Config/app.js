const express = require('express')
const app = express();
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');

app.use(fileUpload())
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));
dotenv.config({ path: "./config.env" });

module.exports = app