const LocalStategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const User = require('./../Models/User');
const  initialize = (passport,getUserByID)=>{
    const authenticateUser = (email,password,done) =>{
        User.findOne({email :email}).then(async user=>{
            try{            
                if(user!=null&&await bcrypt.compare(password,user.password)){
                    return done(null, user);
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
    passport.deserializeUser((user,done)=>{
        done(null,getUserByID(user._id))
    })
}

module.exports = initialize;