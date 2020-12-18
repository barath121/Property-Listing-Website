const Property = require("../Models/Property");
const express = require('express');
const PropertyController = require('../Controller/PropertyController');
const PropertyRoute = express.Router();
PropertyRoute.route('/test').get(PropertyController.test);

module.exports = PropertyRoute;
