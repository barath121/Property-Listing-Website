const express = require('express');
const AdminController = require('../Controller/AdminController');
const AdminRoute = express.Router();

AdminRoute.get('/admindashboard',AdminController.isAdmin,AdminController.AdminDashboard);
AdminRoute.post('/propertyavaliablity',AdminController.isAdmin,AdminController.TogglePropertyAvaliablity); // property id and (true/false)
AdminRoute.post('/deleteproperty',AdminController.isAdmin,AdminController.DeletePropertyAvaliablity); //propertyid
AdminRoute.post('/querysolved',AdminController.isAdmin,AdminController.MarkQuerySolved); //queryid
module.exports = AdminRoute;