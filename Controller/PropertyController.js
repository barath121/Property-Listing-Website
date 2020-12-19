const Property = require('../Models/Property');
const firebase = require('./../Utils/firebaseAdminInit');

module.exports.test = (req,res)=>{
    res.render('Create_property');
}

module.exports.createProperty = async (req,res,next) =>{
//   const images  = req.files;
//   let imagesArray = [];
//   await Promise.all(images.map((image) => (firebase.uploadFile(image).then(result => {
//     imagesArray.push(result)
//   }))))   
//   res.status(200) .json({
//     message: "Upload was successful",
//     data: imagesArray
//   })
const body = req.body;
console.log(body);
  //reference.put('req.files.propertyimage').then();

    // let property = {};
    // property.propertyType = req.body.propertyType;
    // property.propertyFor = req.body.propertyFor;
    // property.locality = req.body.locality;
    // property.priceDetails = {};
    // if(property.propertyFor=='Sale'){
    //   property.priceDetails.expectedPrice = price_in_words(req.body.expectedPrice);
    //   property.priceDetails.bookingAmount = price_in_words(req.body.bookingAmount);
    //   property.priceDetails.transactionType = req.body.transactionType;
    // }
    // if(peoperty.propertyFor=='Rent'){
    //   property.priceDetails.expectedPrice = price_in_words(req.body.expectedPrice);
    //   property.priceDetails.bookingAmount = price_in_words(req.body.bookingAmount);
    // }
    // if(property.propertyFor=='Sale' && property.priceDetails.transactionType=='New Property')
    //   property.priceDetails.possessionStatus = req.body.possessionStatus;
}