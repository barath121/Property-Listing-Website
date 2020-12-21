const StaticRoutes = (app) =>{
    app.get('/', (req, res) => {
        res.render('index')
    })
    app.get('/login', (req, res) => {
        console.log(req.query);
        if(req.query.failed){
            req.flash("error", "Username or password is incorrect.");
        }
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