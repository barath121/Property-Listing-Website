const express = require('express');
const PropertyController = require('../Controller/PropertyController');
const AdminController = require("./../Controller/AdminController");
const PropertyRoute = express.Router();
var multer = require('multer');
var upload = multer({
    storage : multer.memoryStorage()
});
PropertyRoute.get('/editproperty',AdminController.isAdmin,PropertyController.EditProperty);
PropertyRoute.post('/createproperty',upload.any(),AdminController.isAdmin,PropertyController.createProperty);
PropertyRoute.post('/commercialproperty',upload.any(),AdminController.isAdmin,PropertyController.CommercialProperty);
module.exports = PropertyRoute;
