const LocalStategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const User = require('./../Models/User');
const  initialize = (passport,getUserByID)=>{
    const authenticateUser = (email,password,done) =>{
        User.findOne({email :email}).then(async user=>{
            try{       
                if(user!=null&&await bcrypt.compare(password,user.password)){
                    return done(null, user , {message : "Signin Sucessful"});
            }
            else{
                return done(null, false , {message : 'User Email or Password wrong'});
            }   
            }
            catch(e) { 
                return done(e);
            } 
        })
    }
    passport.use(new LocalStategy({usernameField : 'email'},authenticateUser))
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    })
    passport.deserializeUser(async(user,done)=>{
        let userdetils = await User.findById(user)
        done(null,userdetils)
    })
}

module.exports = initialize;