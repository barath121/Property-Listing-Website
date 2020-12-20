const Property = require("../Models/Property");
const firebase = require("./../Utils/firebaseAdminInit");

module.exports.test = (req, res) => {
  res.render("Create_property");
};

module.exports.createProperty = async (req, res, next) => {
  const images  = req.files;
  const body = req.body;
  // let imagesArray = [];
  // await Promise.all(images.map((image) => (firebase.uploadFile(image).then(result => {
  //   imagesArray.push(result)
  // }))))
  let property = {};
  // property.images = imagesArray;
  property.propertyType = req.body.PropertyType;
  property.propertyFor = req.body.Propertyfor;
  property.locality = req.body.Locality;
  property.propertyFeatures = {};
  property.propertyFeatures.bedrooms = req.body.Bedrooms;
  req.body.bedroomArea.forEach((room) => {
    property.propertyFeatures.bedroomArea.push({
      lenght: room.lenght,
      breadth: room.breadth,
    });
  });
  property.propertyFeatures.superBuiltUpArea =
    req.body.superBuiltUpArea[0] + " " + req.body.superBuiltUpArea[1];
  property.propertyFeatures.builtUpArea =
    req.body.builtUpArea[0] + " " + req.body.builtUpArea[1];
  property.propertyFeatures.carpetArea =
    req.body.carpetArea[0] + " " + req.body.carpetArea[1];
  property.propertyFeatures.balconies = req.body.Balconies;
  property.propertyFeatures.bathroom = req.body.bathroom;
  property.propertyFeatures.floorNo = req.body.floorNo;
  property.propertyFeatures.totalFloors = req.body.totalFloors;
  property.propertyFeatures.furnishingStatus = req.body.furnishingStatus;
  req.body.furniture.forEach((furniture) => {
    if (furniture == "Fan") {
      property.propertyFeatures.furnitures.push({
        Type: furniture,
        Quantity: req.body.Quantity[0],
      });
    } else if (furniture == "Light") {
      property.propertyFeatures.furnitures.push({
        Type: furniture,
        Quantity: req.body.Quantity[1],
      });
    } else if (furniture == "Bed") {
      property.propertyFeatures.furnitures.push({
        Type: furniture,
        Quantity: req.body.Quantity[2],
      });
    } else if (furniture == "Wadrobe") {
      property.propertyFeatures.furnitures.push({
        Type: furniture,
        Quantity: req.body.Quantity[3],
      });
    } else if (furniture == "Curtains") {
      property.propertyFeatures.furnitures.push({
        Type: furniture,
        Quantity: req.body.Quantity[4],
      });
    } else {
      property.propertyFeatures.furnitures.push({
        Type: furniture,
        Quantity: req.body.Quantity[4],
      });
    }
  });

  property.priceDetails = {};

  if (property.propertyFor == "Sale") {
    property.priceDetails.expectedPrice = req.body.expectedPrice;
    property.priceDetails.bookingAmount = req.body.bookingAmount;
    property.priceDetails.transactionType = req.body.transactionType;
    property.priceDetails.saleBrokerage = req.body.saleBrokerage;
  }
  if (peoperty.propertyFor == "Rent/Lease") {
    property.priceDetails.expectedRent = req.body.expectedRent;
    property.priceDetails.securityDeposit = req.body.securityDeposit;
    property.priceDetails.rentBrokerage = req.body.rentBrokerage;
  }
  if (property.propertyFor == "Sale" && property.priceDetails.transactionType == "New Property") {
    property.priceDetails.possessionStatus = req.body.possessionStatus;
    if (property.priceDetails.possessionStatus == "Under Construction") {
      property.priceDetails.avaliableFrom = {};
      property.priceDetails.month = req.body.month;
      property.priceDetails.year = req.body.year;
    }
    else if(property.priceDetails.possessionStatus == "Ready to Move"){
      property.priceDetails.ageOfConstruction = req.body.ageOfConstruction;
    }
  }
  property.priceDetails.priceType = req.body.priceType;
  property.priceDetails.maintaninceCharge = req.body.maintaninceCharge;
  property.priceDetails.maintaninceChargeType = req.body.maintaninceChargeType;
  property.priceDetails.priceIncludes = req.body.priceIncludes;
  property.priceDetails.tokenAmount = req.body.tokenAmount;

  property.additionalFeaturess = {};
  prperty.additionalFeatures.additonalRooms = req.body.additonalRooms;
  property.additionalFeatures.facing = req.body.facing;
  property.additionalFeatures.overlooking = req.body.overlooking;
  property.additionalFeatures.carParking = req.body.carParking;
  property.addditionalFeatures.liftsInTheTower = req.body.liftsInTheTower;
  property.additionalFeaturess.multipleUnitsAvaliable = req.body.multipleUnitsAvaliable;

  property.statusOfWaterandElectric = {};
  property.statusOfWaterandElectric.avaliablityOfWater
  property.statusOfWaterandElectric.avaliablityOfElectricity

  property.ownershipAndApproval = {};
  property.ownershipAndApproval.ownershipStatus = req.body.ownershipStatus;
  property.ownershipAndApproval.approvedBy = req.body.approvedBy;

  property.flooring = req.body.flooring;
  property.amenities = req.body.amenities;
  property.description = req.body.description;
  property.landmarks = req.body.landmarks;

  //Creating Database Object
  Property.create.catch(err=>{
    next(err);
  }).then(result=>{
    res.status(201).json({
      status : "Sucessful",
      message : "Property Has Been Created",
      data : result
    })
  })

};
