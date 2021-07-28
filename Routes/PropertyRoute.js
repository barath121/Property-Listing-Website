const express = require('express');
const PropertyController = require('../Controller/PropertyController');
const AdminController = require("./../Controller/AdminController");
const PropertyRoute = express.Router();
var multer = require('multer');
var upload = multer({
    storage : multer.memoryStorage()
});
PropertyRoute.use(AdminController.isAdmin);
PropertyRoute.get('/editproperty',PropertyController.EditProperty);
PropertyRoute.use(upload.any());
PropertyRoute.post('/createproperty',PropertyController.createProperty);
PropertyRoute.post('/commercialproperty',PropertyController.CommercialProperty);
module.exports = PropertyRoute;
