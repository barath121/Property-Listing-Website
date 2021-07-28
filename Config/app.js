const express = require('express')
const app = express();
const path = require("path");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');
const passport = require('passport');
const initializePassport = require('./passport');
const  session  = require('express-session');
const flash = require('express-flash');
dotenv.config({ path: "./.env" });

initializePassport(passport);
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
app.use(flash());

module.exports = app