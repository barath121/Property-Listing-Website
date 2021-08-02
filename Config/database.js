const mongoose = require('mongoose');
module.exports.connect =()=>{
new Promise(async(resolve,reject) =>{
let DBstring = "";
if(process.env.NODE_ENV=="test")DBstring = process.env.TEST_DATABASE;
else if(process.env.NODE_ENV == 'prod')DBstring = process.env.PROD_DATABASE;
else DBstring = process.env.DEV_DATABASE;

let options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};
mongoose.connect(DBstring,options)
.then(conn=>{
    if(process.env.NODE_ENV!='test'&&process.env.NODE_ENV!='prod')
    console.log("Connection to database sucessful");
    resolve();
})
.catch(err=>{
    if(process.env.NODE_ENV='test'&&process.env.NODE_ENV!='prod')
    console.log("Connection Failed "+err );
    reject();
})
})}
module.exports.close = () =>{
new Promise((resolve,reject) =>{
    mongoose.disconnect().then(conn=>{
        if(process.env.NODE_ENV!='test'&&process.env.NODE_ENV!='prod')
        console.log("Connection Closed");
        resolve();
        })
        .catch(err=>{
            if(process.env.NODE_ENV!='test'&&process.env.NODE_ENV!='prod')
            console.log("Connection Failed to Close "+err );
            reject();
        })
})
}