PropertyRoutes = require('./PropertyRoute')
const AppError = require('./../Utils/appError');
const Routesinit = (app) => {

    // Terry created routes 
    app.get('/', (req, res) => {
        res.render('index')
    })

    app.get('/contact', (req, res) => {
        res.render('contact')
    })

    app.get('/property-detail', (req, res) => {
        res.render('property-detail')
    })

    // -----------------------------

    app.use('/property', PropertyRoutes);
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
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    })
}
module.exports = Routesinit;