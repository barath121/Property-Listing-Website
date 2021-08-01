const mongoose = require('mongoose');
module.exports.connect = async() =>{
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
})
.catch(err=>{
    if(process.env.NODE_ENV='test'&&process.env.NODE_ENV!='prod')
    console.log("Connection Failed "+err );
})
}
module.exports.close = () =>{
    mongoose.disconnect().then(conn=>{
        if(process.env.NODE_ENV!='test'&&process.env.NODE_ENV!='prod')
        console.log("Connection Closed");
        })
        .catch(err=>{
            if(process.env.NODE_ENV!='test'&&process.env.NODE_ENV!='prod')
            console.log("Connection Failed to Close "+err );
        })
}