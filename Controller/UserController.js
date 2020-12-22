const User = require('./../Models/User');
const bcrypt = require('bcrypt');
module.exports.test = (req,res) =>{
  console.log(req.isAuthenticated());
console.log(req.user.name)
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
      res.status(201).json({
        status : "Sucessful",
        message: "Account Created Suceessfully",
        data : result
      })
    })
}

