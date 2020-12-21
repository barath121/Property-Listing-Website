PropertyRoutes = require('./PropertyRoute')
const AppError = require('./../Utils/appError');
const UserRoute = require('./UserRoute');
const PropertyRoute = require('./PropertyRoute');
const multer = require('multer');
const StaticRoutes = require('./StaticRoutes');
const Routesinit = (app) => {
    app.use((req, res, next) => {
        res.locals.req = req
        next()
    })
    
    StaticRoutes(app);
    app.use('/property', PropertyRoutes);
    app.use('/user',UserRoute);
    app.use('/search', (req,res)=>{
        res.render('Search_page')
    });

    app.use((req, res, next) => {
        const err = new Error("Hello");
        err.status = 'fail';
        err.statusCode = 404;
        next(new AppError(`Cannot Find the ${req.originalUrl} on server`, 404));
    });
   
    app.use((err, req, res, next) => {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'Internal Server Error';
        if (err.name === 'MongoError' && err.code === 11000) {
            err.message =  "Email  or Phone Number already exists"
        }
        else if (err.name === 'ValidationError') {
           err.message =  "Please enter all required fields"
        }
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    })
}
module.exports = Routesinit;