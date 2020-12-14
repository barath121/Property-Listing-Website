const express = require('express')
const app = express();
const path = require("path");
const appError = require('./../Utils/appError')
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');
const AppError = require('./../Utils/appError');

app.use(fileUpload())
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));
dotenv.config({ path: "./.env" });

app.set("views", path.join(__dirname, "../Views"));
app.set("view engine", "ejs");

  
module.exports = app