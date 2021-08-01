const express = require('express');
const AdminController = require('../Controller/AdminController');
const AdminRoute = express.Router();
AdminRoute.use(AdminController.isAdmin);
AdminRoute.get('/admindashboard',AdminController.adminDashboard);
AdminRoute.post('/propertyavaliablity',AdminController.togglePropertyAvaliablity); // property id and (true/false)
AdminRoute.post('/deleteproperty',AdminController.deleteProperty); //propertyid
AdminRoute.post('/querysolved',AdminController.markQuerySolved); //queryid
module.exports = AdminRoute;