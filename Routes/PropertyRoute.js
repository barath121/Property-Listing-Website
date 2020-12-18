const Property = require("../Models/Property");
const express = require('express');
const PropertyController = require('../Controller/PropertyController');
const PropertyRoute = express.Router();
var multer = require('multer');
var upload = multer({
    storage : multer.memoryStorage()
});
PropertyRoute.route('/test').get(PropertyController.test);
PropertyRoute.post('/createproperty',upload.any(),PropertyController.createProperty);
module.exports = PropertyRoute;
