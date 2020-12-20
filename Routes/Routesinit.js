PropertyRoutes = require('./PropertyRoute')
const AppError = require('./../Utils/appError');
const UserRoute = require('./UserRoute');
const PropertyRoute = require('./PropertyRoute');
const multer = require('multer');
const Routesinit = (app) => {
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        res.locals.error = req.flash('error')
        res.locals.created_msg = req.flash('created_msg')
        res.locals.yours_msg = req.flash('yours_msg')
        res.locals.req = req
        next()
    })
    app.get('/', (req, res) => {
        res.render('index')
    })

    app.get('/contact', (req, res) => {
        res.render('contact')
    })

    app.get('/property-detail', (req, res) => {
        res.render('property-detail')
    })
    app.get('/newproperty', (req, res) => {
        res.render('Create_property')
    })
    app.get('/newproperty2', (req, res) => {
        res.render('Create_property_2')
    })
    // -----------------------------

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