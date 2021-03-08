PropertyRoutes = require('./PropertyRoute')
const AppError = require('./../Utils/appError');
const UserRoute = require('./UserRoute');
const PropertyRoute = require('./PropertyRoute');
const multer = require('multer');
const StaticRoutes = require('./StaticRoutes');
const AdminRoute = require('./AdminRoute');
const wwwRedirect= (req, res, next) =>{
    if (req.headers.host.slice(0, 4) === 'www.') {
        var newHost = req.headers.host.slice(4);
        return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
    }
    if(req.headers.host.includes("evennode")){
        return res.redirect(301, "https://santoshproperty.in");
    }
    next();
};

const Routesinit = (app) => {
    app.use((req, res, next) => {
        res.locals.req = req
        next()
    })
    app.set('trust proxy', true);
    app.use(wwwRedirect);
    StaticRoutes(app);
    app.use('/property', PropertyRoutes);
    app.use('/user',UserRoute);
    app.use('/admin',AdminRoute);
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