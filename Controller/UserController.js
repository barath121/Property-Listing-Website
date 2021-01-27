const User = require('./../Models/User');
const bcrypt = require('bcrypt');
const Enquiry = require('../Models/Enquiry');
const Saved = require('../Models/Saved');
const mongoose = require('mongoose');
const Property = require('../Models/Property');
module.exports.test = (req,res) =>{
  console.log(req.isAuthenticated());
console.log(req.user.name)
}
module.exports.Redirect = (req,res) =>{
  console.log(req.user);
  if(req.user.isAdmin){
    res.redirect('/admin/admindashboard');
  }
  else{
    res.redirect('/');
  }
}
module.exports.CheckLogin = (req,res,next) =>{
  if(req.isAuthenticated()){
    next();
  }
  else{
    req.flash("error","Login to Continue");
    res.redirect("/");
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
    if(req.body.page=="dashboard"){
      req.flash("Success","Your Request Have Been Sumbitted Your Will Be Contacted By Our Agent Soon");
      res.redirect("/dashboard");
    }
    else{
    req.flash("Success","Your Request Have Been Sumbitted Your Will Be Contacted By Our Agent Soon");
    res.redirect("/contact");}
  }
  });
}
module.exports.AddSaved = (req,res,next) =>{
  let saved = {}
  saved.customerID = req.user._id;
  saved.propertyID = req.query.propertyid;
  let propertytype  = req.query.propertytype;
  Saved.create(saved) 
  .catch(err=>{
    next(err);
  })
  .then(result=>{
    if(result){
      req.flash("success","Property Has Been Saved");
      res.redirect('/property?type='+propertytype+'&id='+saved.propertyID);
      console.log(saved);
    }
  })
}
module.exports.RemoveSaved = (req,res,next) =>{
  let saved = {}
  saved.customerID = req.user._id;
  saved.propertyID = req.query.propertyid;
  let propertytype  = req.query.propertytype;
  Saved.findOneAndRemove({$and : [
    {customerID : saved.customerID},
    {propertyID : saved.propertyID}
  ]}) 
  .catch(err=>{
    next(err);
  })
  .then(result=>{
    if(result){
      req.flash("success","Property Has Been Removed");
      res.redirect('/property?type='+propertytype+'&id='+saved.propertyID);
    }
  })
}
module.exports.userdashboard =(req,res,next) =>{
Saved.find({customerID:req.user._id}).populate({path:'propertyID',select:'propertyType propertyFor name locality furnishing description'})
 .then(result=>{
  res.render('userDashboard',{
    savedProperties : result
  })
})
//  console.log(saveddata);
// console.log(req.user._id);
// let saveddata =Saved.find({customerID: req.user._id})

// console.log(saveddata);
// Saved.aggregate([
//   {$match : {"customerID":req.user._id}},
 
//   ])
//   .catch(err=>{
//     next(err);
//   }).then(dat=>{
//     console.log(dat);
//   })
}
