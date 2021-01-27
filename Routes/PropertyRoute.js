const express = require('express');
const PropertyController = require('../Controller/PropertyController');
const PropertyRoute = express.Router();
var multer = require('multer');
var upload = multer({
    storage : multer.memoryStorage()
});
PropertyRoute.route('/test').get(PropertyController.test);
PropertyRoute.route('/test2').get((req,res)=>{
    res.render('Create_property_2')
})



PropertyRoute.post('/createproperty',upload.any(),PropertyController.createProperty);
PropertyRoute.post('/commercialproperty',upload.any(),PropertyController.CommercialProperty);
PropertyRoute.get('/editproperty',PropertyController.EditProperty);
module.exports = PropertyRoute;
