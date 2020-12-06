PropertyRoutes = require('./PropertyRoute')
const Routesinit = (app) =>{
    app.use('/property',PropertyRoutes);
}
module.exports = Routesinit;