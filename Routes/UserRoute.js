const express = require('express');
const passport = require('passport');
const UserController = require('../Controller/UserController');
const User = require('../Models/User');
const UserRoute = express.Router();

UserRoute.route('/login').post(passport.authenticate('local',{
    successRedirect : '/',
    failureRedirect : "/about",
    failureFlash : true
}));
UserRoute.route('/register').post(UserController.Register);
UserRoute.route('/test').get(UserController.test);

module.exports = UserRoute;
