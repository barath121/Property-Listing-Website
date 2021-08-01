module.exports.renderLoginPage = (req, res) => { res.render('login') }
module.exports.renderRegisterPage = (req, res) => { res.render('register') }
module.exports.renderAboutPage = (req, res) => { res.render('contact') }
module.exports.renderContactPage = (req, res) => { res.render("about"); }
module.exports.renderCreateResidentialProperty = (req, res) => { res.render('Create_property', { property: false, Furniture: false, Quantity: false }) }
module.exports.renderCreateCommercialProperty = (req, res) => { res.render('commercial_property', { property: false }) }
module.exports.render404Page = (req, res) => { res.render('404'); }