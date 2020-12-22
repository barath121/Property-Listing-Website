const StaticRoutes = (app) =>{
    app.get('/', (req, res) => {
        res.render('index')
    })
    app.get('/adminlogin', (req, res) => {
        res.render('adminLogin')
    })
    app.get('/login', (req, res) => {
        res.render('login')
    })
    app.get('/register', (req, res) => {
        res.render('register')
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
    app.get('/dashboard', (req, res) => {
        res.render('userDashboard')
    })
}

module.exports = StaticRoutes;