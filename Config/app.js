const express = require('express')
const app = express();
const appError = require('./../Utils/appError')
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');
const AppError = require('./../Utils/appError');

app.use(fileUpload())
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));
dotenv.config({ path: "./.env" });



app.use((req, res, next)=>{
    const err = new Error("Hello");
    err.status = 'fail';
    err.statusCode = 404;
    next(new AppError(`Cannot Find the ${req.originalUrl} on server`,404));
});
app.use((err,req,res,next)=>{
   err.statusCode = err.statusCode || 500;
   err.status = err.status || 'Internal Server Error';
   res.status(err.statusCode).json({
       status : err.status,
       message : err.message
   })
})
  
module.exports = app