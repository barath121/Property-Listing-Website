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
UserRoute.route('/logout').get(UserController.logout);
UserRoute.route('/addenquiry').post(UserController.AddEnquiry);
UserRoute.route('/forgotpassword').post(UserController.forgotpassword);
UserRoute.use(UserController.CheckLogin);
UserRoute.route('/addsaved').get(UserController.AddSaved);
UserRoute.route('/removesaved').get(UserController.RemoveSaved);
UserRoute.route('/changepassword').post(UserController.changepassword);
module.exports = UserRoute;
