const express = require('express');
const AdminController = require('../Controller/AdminController');
const AdminRoute = express.Router();
AdminRoute.use(AdminController.isAdmin);
AdminRoute.get('/admindashboard',AdminController.AdminDashboard);
AdminRoute.post('/propertyavaliablity',AdminController.TogglePropertyAvaliablity); // property id and (true/false)
AdminRoute.post('/deleteproperty',AdminController.DeletePropertyAvaliablity); //propertyid
AdminRoute.post('/querysolved',AdminController.MarkQuerySolved); //queryid
module.exports = AdminRoute;