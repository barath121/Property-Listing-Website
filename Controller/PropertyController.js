const Property = require('../Models/Property');

module.exports.test = (req,res)=>{
    // console.log("working");
    // res.status(200).json({
    //     status:"Sucess"
    // })
    res.render('Create_property');
}