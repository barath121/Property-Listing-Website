const User = require('./../Models/User');
const bcrypt = require('bcrypt');
const Enquiry = require('../Models/Enquiry');
module.exports.test = (req,res) =>{
  console.log(req.isAuthenticated());
console.log(req.user.name)
}
module.exports.Redirect = (req,res) =>{
  if(req.user.isAdmin){
    res.redirect('/admin/admindashboard');
  }
  else{
    res.redirect('/');
  }
}
module.exports.Register = async (req,res,next) =>{
    let user = {};
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.name = req.body.name;
    user.password = await bcrypt.hash(/*req.body.password*/"Hello",parseInt(process.env.Salt));
    User.create(user).catch(err=>{
      next(err);
    }).then(result=>{
        if(result)
    {  req.flash("sucess","Account created sucessfully password has been sent to your mobile number");
      res.redirect("/login");}
    })
}
module.exports.logout = (req,res) =>{
  req.logOut();
  res.redirect('/login');
}
module.exports.AddEnquiry = (req,res,next) =>{
  let enquiry = {}
  enquiry.email = req.body.email;
  enquiry.name = req.body.name;
  enquiry.contactno = req.body.contactno;
  enquiry.message = req.body.message;
  console.log(enquiry);
  Enquiry.create(enquiry)
  .catch(err=>{
    next(err);
  })
  .then(result=>{
    if(result){
    req.flash("Success","Your Request Have Been Sumbitted Your Will Be Contacted By Our Agent Soon");
    res.redirect("/contact");}
  });
}