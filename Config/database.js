const mongoose = require('mongoose');
const DatabaseSetup = () =>{
let DBstring = "";
if(process.env.NODE_ENV == 'prod'){
DBstring = process.env.PROD_DATABASE;
}
else{
DBstring = process.env.DEV_DATABASE;
}
let options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};
mongoose.connect(DBstring,options)
.then(conn=>{
console.log("Connection to database sucessful");
})
.catch(err=>{
    console.log("Connection Failed "+err );
})
}
module.exports = DatabaseSetup;