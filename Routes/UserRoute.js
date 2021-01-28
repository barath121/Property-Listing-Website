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
UserRoute.route('/addsaved').get(UserController.CheckLogin,UserController.AddSaved);
UserRoute.route('/removesaved').get(UserController.CheckLogin,UserController.RemoveSaved);
UserRoute.route('/changepassword').post(UserController.CheckLogin,UserController.changepassword);
module.exports = UserRoute;
