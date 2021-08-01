const PropertyController = require("../Controller/PropertyController");
const UserController = require("./../Controller/UserController");
const AdminController = require("./../Controller/AdminController");
const StaticController = require("./../Controller/Static");
const StaticRoutes = (app) => {
    app.get('/', PropertyController.homePage);
    app.get('/login', StaticController.renderLoginPage);
    app.get('/register', StaticController.renderRegisterPage);
    app.get('/contact', StaticController.renderAboutPage);
    app.get('/about', StaticController.renderContactPage);
    app.get('/property', PropertyController.viewProperty);
    app.use('/search', PropertyController.search);
    app.get('/searchcommercial', PropertyController.searchCommercial);
    app.get('/404', StaticController.render404Page);
    app.get('/createresidentialproperty', AdminController.isAdmin, StaticController.renderCreateResidentialProperty);
    app.get('/createcommercialproperty', AdminController.isAdmin, StaticController.renderCreateCommercialProperty);
    app.get('/dashboard', UserController.checkLogin, UserController.userdashboard);
    
}

module.exports = StaticRoutes;