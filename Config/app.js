const express = require('express')
const app = express();
const path = require("path");
const appError = require('./../Utils/appError')
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');
const passport = require('passport');
const AppError = require('./../Utils/appError');
const initializePassport = require('./passport');
const  session  = require('express-session');
const User = require('../Models/User');
dotenv.config({ path: "./.env" });

initializePassport(passport,id=>User.findById(id));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, '../public')))
app.use(session({
    secret : process.env.sessionsecret,
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set("views", path.join(__dirname, "../Views"));
app.set("view engine", "ejs");

  
module.exports = app