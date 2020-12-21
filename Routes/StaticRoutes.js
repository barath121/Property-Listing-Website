const StaticRoutes = (app) =>{
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
}

module.exports = StaticRoutes;