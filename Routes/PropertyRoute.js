const Property = require("../Models/Property");
const express = require('express');
const PropertyController = require('../Controller/PropertyController');
const PropertyRoute = express.Router();
PropertyRoute.route('/test').get(PropertyController.test);
PropertyRoute.route('/test2').get((req,res)=>{
    res.render('Create_property_2')
})



module.exports = PropertyRoute;
