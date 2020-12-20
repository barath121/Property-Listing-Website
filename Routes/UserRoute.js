const express = require('express');
const passport = require('passport');
const UserController = require('../Controller/UserController');
const UserRoute = express.Router();

UserRoute.route('/login').post(passport.authenticate('local',{
    successRedirect : '/',
}));
UserRoute.route('/register').post(UserController.Register);




module.exports = UserRoute;
