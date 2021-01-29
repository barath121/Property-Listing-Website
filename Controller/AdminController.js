const Commercial = require('../Models/Commercial');
const Enquiry = require('../Models/Enquiry');
const Property = require('../Models/Property');
const Saved = require('../Models/Saved');
const User = require('./../Models/User');
const firebase = require("./../Utils/firebaseAdminInit");

const converttocardData = (Data) =>{
    Data.forEach((element) => {
        property = {};
        element.Images.images.forEach(img=>{
          if(img.includes("CoverImages")){
            property.image = img;
          }
        })
        property.title =
          element.propertyType +
          " For " +
          element.propertyFor +
          " at " +
          element.name+
          ", "+
          element.locality
          ;
        property.area = element.propertyFeatures.carpetArea;
        property.furnishing = element.propertyFeatures.furnishingStatus;
        property.status =
          element.priceDetails.possessionStatus ||
          "Possession by " +
            element.priceDetails.avaliableFrom.month +
            " " +
            element.priceDetails.avaliableFrom.year;
        property.price =
          element.priceDetails.expectedPrice || element.priceDetails.expectedRent;
        property.bedroom = element.propertyFeatures.bedrooms + " Bed";
        property.bathroom = element.propertyFeatures.bathroom + " Bath";
        properties.push(property);
      });
      return Data;
}
module.exports.isAdmin = (req,res,next) =>{
    if(req.isAuthenticated() && req.user.isAdmin){
        next();
    }
    else{
        res.redirect("/");
    }
}

module.exports.AdminDashboard = async (req,res,next) =>{
    const Page = req.query.page||1;
    const limit = req.query.limit * 1||14;
    const skip = (Page - 1) * limit;
    let saved = {};
    if(req.query.number){
     await User.findOne({phone : req.query.number}).then(async user=>{
      //  console.log(user)
      saved = await Saved.find({customerID:user._id}).populate({path:'propertyID',select:'propertyType propertyFor name locality furnishing description'})
      // console.log(saved);
   }).catch(err=>next(err));
    }
    
    Commercial.aggregate([{
      $facet : {
        "ActivatedProperty" : [
          {
            $match : {
              isAvaliable : true
            },
          },
            {
              $project:{
                title:{
                  $concat : ["$propertyType"," For ","$propertyFor"," at ","$name",",",'$locality']
                },
                isAvaliable : 1,
                address : 1,
                createdAt : 1,
                "expectedPrice" : 1,
                "expectedRent" : 1,
                "areaDetails.carpetArea" : 1
              }
            }
        ],
        "DisabledProperty" : [
          {
            $match : {
              isAvaliable : false
            }
          },
          {
            $project:{
              title:{
                $concat : ["$propertyType"," For ","$propertyFor"," at ","$name",",",'$locality']
              },
              isAvaliable : 1,
              address : 1,
              createdAt : 1,
              "expectedPrice" : 1,
              "expectedRent" : 1,
              "areaDetails.carpetArea" : 1
            }
          }
        ],
        "AllProperty" : [
          {
            $match : {$or : [
              {isAvaliable : true},
              {isAvaliable : false}
            ]}
          },
            {
              $project:{
                title:{
                  $concat : ["$propertyType"," For ","$propertyFor"," at ","$name",",",'$locality']
                },
                isAvaliable : 1,
                address : 1,
                createdAt : 1,
                "expectedPrice" : 1,
                "expectedRent" : 1,
                "areaDetails.carpetArea" : 1
              }
            }
        ]
      }
    }]).catch(err=>{
      console.log(err)
    }).then(async commercialresult=>{
      Property.aggregate([{
        $facet : {
          "ActivatedProperty" : [
            {
              $match : {
                isAvaliable : true
              },
            },
              {
                $project:{
                  title:{
                    $concat : ["$propertyType"," For ","$propertyFor"," at ","$name",",",'$locality']
                  },
                  isAvaliable : 1,
                  address : 1,
                  createdAt : 1,
                  "priceDetails.expectedPrice" : 1,
                  "priceDetails.expectedRent" : 1,
                  "propertyFeatures.carpetArea" : 1
                }
              }
          ],
          "DisabledProperty" : [
            {
              $match : {
                isAvaliable : false
              }
            },
            {
              $project:{
                title:{
                  $concat : ["$propertyType"," For ","$propertyFor"," at ","$name",",",'$locality']
                },
                isAvaliable : 1,
                address : 1,
                createdAt : 1,
                "priceDetails.expectedPrice" : 1,
                "priceDetails.expectedRent" : 1,
                "propertyFeatures.carpetArea" : 1
              }
            }
          ],
          "AllProperty" : [
            {
              $match : {$or : [
                {isAvaliable : true},
                {isAvaliable : false}
              ]}
            },
              {
                $project:{
                  title:{
                    $concat : ["$propertyType"," For ","$propertyFor"," at ","$name",",",'$locality']
                  },
                  isAvaliable : 1,
                  address : 1,
                  createdAt : 1,
                  "priceDetails.expectedPrice" : 1,
                  "priceDetails.expectedRent" : 1,
                  "propertyFeatures.carpetArea" : 1
                }
              }
          ]
        }
      }]).catch(err=>{
        console.log(err)
      }).then(async result=>{
        // console.log(result);
        let customer = await User.find({isAdmin : false}).sort({_id:-1});
        let enquiries = await Enquiry.find({contacted : false});
        // console.log(customer)
        res.render("adminDashboard",{
          customer :customer,
          commercial : commercialresult,
          properties : result,
          enquiries : enquiries,
          saved : saved
        })
      })
    })
}

module.exports.TogglePropertyAvaliablity = (req,res,next) =>{
  if(req.body.type == "commercial"){
    Commercial.findByIdAndUpdate(req.body.id,{isAvaliable : req.body.status}).then(property=>{
      if(req.body.status=="flase"){
        req.flash("success","Property has ben Activated");
      }
      else{
        req.flash("success","Property has been Deactived");
      }
      res.redirect('/admin/admindashboard')
    }).catch(err=>{next(err)});
  }
  else{
  Property.findByIdAndUpdate(req.body.id,{isAvaliable : req.body.status}).then(property=>{
    if(req.body.status=="flase"){
      req.flash("success","Property has ben Activated");
    }
    else{
      req.flash("success","Property has been Deactived");
    }
    res.redirect('/admin/admindashboard')
  }).catch(err=>{next(err)});}
}

module.exports.DeletePropertyAvaliablity = (req,res,next) =>{
  if(req.body.type == "commercial"){
    Commercial.findById(req.body.id).then(result=>{
      firebase.deleteFile(result.Images.images);
      Saved.remove({propertyID : req.body.id})
      Property.findByIdAndDelete(req.body.id).then(deleted=>{
        req.flash("success","Property Has Been Removed");
        res.redirect('/admin/admindashboard')
      });
    }).catch(err=>{
      console.log(err)
      next(err)})
  }else{
  Property.findById(req.body.id).then(result=>{
    firebase.deleteFile(result.Images.images);
    Saved.remove({propertyID : req.body.id})
    Property.findByIdAndDelete(req.body.id).then(deleted=>{
      req.flash("success","Property Has Been Removed");
      res.redirect('/admin/admindashboard')
    });
  }).catch(err=>{
    console.log(err)
    next(err)})
  }
  // res.redirect('/admin/admindashboard')
}

module.exports.MarkQuerySolved = (req,res) =>{
  Enquiry.findByIdAndUpdate(req.body.id,{contacted : true}).then(saved=>{
    req.flash("success","Enquiry Has Been Solved");
    res.redirect("/admin/admindashboard");
  });
}