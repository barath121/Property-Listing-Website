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
UserRoute.route("/loginredirect").get(UserController.redirect);
UserRoute.route('/register').post(UserController.register);
UserRoute.route('/logout').get(UserController.logout);
UserRoute.route('/addenquiry').post(UserController.addEnquiry);
UserRoute.route('/forgotpassword').post(UserController.forgotPassword);
UserRoute.use(UserController.checkLogin);
UserRoute.route('/addsaved').get(UserController.addSaved);
UserRoute.route('/removesaved').get(UserController.removeSaved);
UserRoute.route('/changepassword').post(UserController.changePassword);
module.exports = UserRoute;
