const express = require('express');
const AdminController = require('../Controller/AdminController');
const AdminRoute = express.Router();

AdminRoute.get('/admindashboard',AdminController.isAdmin,AdminController.AdminDashboard);



module.exports = AdminRoute;