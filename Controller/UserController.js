const User = require('./../Models/User');
const bcrypt = require('bcrypt');
const Enquiry = require('../Models/Enquiry');
const Saved = require('../Models/Saved');
const https = require('https')
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 8);
const flashSuccess = "success";
module.exports.Redirect = (req,res) =>{
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
    let user = req.body;
    let unencrypted_password =nanoid();
    user.password = await bcrypt.hash(unencrypted_password,parseInt(process.env.Salt));

    const data = JSON.stringify({"From":"SNTSHP",
    "To":req.body.phone,
    "TemplateName":"Password",
    "VAR1":req.body.name,
    "VAR2":unencrypted_password
    });
    const options = {
      hostname: '2factor.in',
      path: '/API/V1/'+process.env.smskey+'/ADDON_SERVICES/SEND/TSMS',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const postreq = https.request(options, theresult => {
      theresult.on('data', d => {
        process.stdout.write(d)
      })
    })

    postreq.on('error', error => {
      console.error(error)
    })

    postreq.write(data)
    postreq.end()
    User.create(user).catch(err=>{
      next(err);
    }).then(result=>{
    if(result) {  
      req.flash(flashSuccess,"Account created sucessfully password has been sent to your mobile number");
      res.redirect("/login");
    }
    })
}
module.exports.forgotpassword = async (req,res) =>{
    let unencrypted_password =nanoid();
    let password = await bcrypt.hash(unencrypted_password,parseInt(process.env.Salt));
    User.findOneAndUpdate({
      phone : phone
    },{
      password : password
    }).catch(err=>{
      next(err);
    }).then(result=>{
        if(result)
    { 
      const data = JSON.stringify({"From":"SNTSHP",
      "To":req.body.phone,
      "TemplateName":"Password",
      "VAR1":req.body.name,
      "VAR2":unencrypted_password
      });
      const options = {
        hostname: '2factor.in',
        path: '/API/V1/'+process.env.smskey+'/ADDON_SERVICES/SEND/TSMS',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      }
  
      const postreq = https.request(options, theresult => {
        theresult.on('data', d => {
          process.stdout.write(d)
        })
      })
  
      postreq.on('error', error => {
        console.error(error)
        User.findOneAndUpdate({
          phone : phone
        },{
          password : result.password
        }).catch(err=>{
          next(err);
        }).then(result=>{
            if(result){
              req.flash(flashSuccess,"Some Error Please Try Again");
              res.redirect("/login");
            }
          })
      })
  
      postreq.write(data)
      postreq.end()
      req.flash(flashSuccess,"Your New Password Has Been Sent to your phone");
      res.redirect("/login");}
    })
   
}
module.exports.logout = (req,res) =>{
  req.logOut();
  res.redirect('/login');
}
module.exports.AddEnquiry = (req,res,next) =>{
  let enquiry = req.body;
  Enquiry.create(enquiry)
  .catch(err=>{
    next(err);
  })
  .then(result=>{
    if(result){
    if(req.body.page=="dashboard"){
      req.flash(flashSuccess,"Your Request Have Been Sumbitted Your Will Be Contacted By Our Agent Soon");
      res.redirect("/dashboard");
    }
    else{
    req.flash(flashSuccess,"Your Request Have Been Sumbitted Your Will Be Contacted By Our Agent Soon");
    res.redirect("/contact");}
  }
  });
}
module.exports.AddSaved = (req,res,next) =>{
  let saved = {}
  saved.customerID = req.user._id;
  let propertytype = req.query.propertytype
  if(req.query.propertytype == "commercial")
  saved.commercialID = req.query.propertyid;
  else
  saved.residentalID = req.query.propertyid;
  Saved.create(saved) 
  .catch(err=>{
    next(err);
  })
  .then(result=>{
    if(result){
      req.flash(flashSuccess,"Property Has Been Saved");
      res.redirect('/property?type='+propertytype+'&id='+saved.propertyID);
    }
  })
}
module.exports.RemoveSaved = (req,res,next) =>{
  let saved = {}
  saved.customerID = req.user._id;
  if(req.query.propertytype == "commercial")
  saved.commercialID = req.query.propertyid;
  else
  saved.residentalID = req.query.propertyid;
  Saved.findOneAndRemove({$and : [
    {customerID : saved.customerID},
    {$or:[{residentalID : saved.residentalID},{commercialID : saved.commercialID}]}
  ]}) 
  .catch(err=>{
    next(err);
  })
  .then(result=>{
    if(result){
      req.flash(flashSuccess,"Property Has Been Removed");
      res.redirect('/property?type='+req.query.propertytype+'&id='+saved.propertyID);
    }
  })
}
module.exports.userdashboard =(req,res,next) =>{
Saved.find({customerID:req.user._id}).populate({path:'residentalID commercialID',select:'propertyType propertyFor name locality furnishing description'})
 .then(result=>{
  res.render('userDashboard',{
    savedProperties : result
  })
})
}
module.exports.changepassword  = (req,res,next) =>{
let oldpassword = req.body.oldpassword;
let newpassword  = req.body.newpassword;
User.findById(req.user._id).then(async user=>{
  if(user){
    if(await bcrypt.compare(oldpassword,user.password)){
     let encrypted_password = await bcrypt.hash(newpassword,parseInt(process.env.Salt));
        await User.findByIdAndUpdate(user._id,{password : encrypted_password});
        req.flash(flashSuccess,"Password Has Been Changed");
        res.redirect('/dashboard');
    }
    else{
      req.flash(flashSuccess,"Please Check Your Old Password");
        res.redirect('/dashboard');
    }
  }
})
}