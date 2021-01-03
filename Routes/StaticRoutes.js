const PropertyController = require("../Controller/PropertyController");
const User = require("../Models/User");
const UserController = require("./../Controller/UserController");
const StaticRoutes = (app) =>{
    app.get('/', PropertyController.HomePage);
    app.get('/admindashboard', (req, res) => {
        res.render('adminDashboard')
    })
    app.get('/login', (req, res) => {
        res.render('login')
    })
    app.get('/register', (req, res) => {
        res.render('register')
    })
    app.get('/contact', (req, res) => {
        res.render('contact')
    })
    app.get('/property', PropertyController.ViewProperty);
    app.get('/newproperty', (req, res) => {
        res.render('Create_property')
    })
    app.get('/dashboard', UserController.CheckLogin,UserController.userdashboard);
    app.get('/commercialproperty', (req, res) => {
        res.render('commercial_property')
    })
    app.use('/search',PropertyController.Search);
}

module.exports = StaticRoutes;