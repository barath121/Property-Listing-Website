const express = require('express');
const passport = require('passport');
const UserController = require('../Controller/UserController');
const User = require('../Models/User');
const UserRoute = express.Router();

UserRoute.route('/login').post(passport.authenticate('local',{
    successRedirect : '/user/loginredirect',
    failureRedirect : "/login",
    failureFlash : true
}));
UserRoute.route("/loginredirect").get(UserController.Redirect);
UserRoute.route('/register').post(UserController.Register);
UserRoute.route('/test').get(UserController.test);
UserRoute.route('/logout').get(UserController.logout);
UserRoute.route('/addenquiry').post(UserController.AddEnquiry);
UserRoute.route('/addsaved').post(UserController.CheckLogin,UserController.AddSaved);
UserRoute.route('/removesaved').delete(UserController.CheckLogin,UserController.RemoveSaved);
module.exports = UserRoute;
