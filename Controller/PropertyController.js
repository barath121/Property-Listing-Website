const Residential = require("../Models/Residential");
const Commercial = require("../Models/Commercial");
const firebase = require("./../Utils/firebaseAdminInit");
const fs = require("fs")
const { customAlphabet } = require("nanoid");
const Saved = require("../Models/Saved");
const sharp = require("sharp");
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 15);
const flashSuccess = "success";
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
const cleanObject = (obj) => {
  return Object.entries(obj).reduce((a, [k, v]) => (v == null || v == '' || v == undefined ? a : (a[k] = v, a)), {});
}
const convertToSq = (area, unit) => {
  if (unit == "Sqft") {
    return area;
  } else if (unit == "Acre") {
    return area * 43560;
  } else if (unit == "Sq-M") {
    return area * 10.7639;
  } else return area;
};
module.exports.viewProperty = catchAsync(async(req, res, next) => {
  let id = req.query.id;
  let type = req.query.type;
  let similarproperties = [];
  let localityproperties = [];
  if (type == "residential") {
    let savedetails = {};
    Residential.findById(id)
      .then(async (property) => {
        if (property) {
          savedetails.propertytype = "residential";
          savedetails.propertyid = property._id;
          try {
            similarproperties = await Residential.find({
              $or: [
                { propertyType: property.propertyType },
                { propertyFor: property.propertyFor },
              ],
            }).limit(10);
            localityproperties = await Residential.find({
              locality: property.locality,
            }).limit(10);
          } catch {
            (err) => {
              next(err);
            };
          }
          let saved = null;
          if (req.isAuthenticated()) {
            saved = await Saved.findOne({
              $and: [
                { residentialID: property._id },
                { customerID: req.user._id },
              ],
            });
          }
          let issaved = false;
          if (saved) {
            issaved = true;
          }
          res.render("property-detail", {
            savedetails: savedetails,
            property: property,
            issaved: issaved,
            similar: similarproperties,
            nearby: localityproperties,
          });
        } else {
          res.redirect("/404");
        }
      })
      .catch((err) => {
        next(err);
      });
  }
  if (type == "commercial") {
    let savedetails = {};
    Commercial.findById(id)
      .then(async (property) => {
        if (property) {
          savedetails.propertytype = "commercial";
          savedetails.propertyid = property._id;

          try {
            similarproperties = await Commercial.find({
              $or: [
                { propertyType: property.propertyType },
                { propertyFor: property.propertyFor },
              ],
            }).limit(10);
            localityproperties = await Commercial.find({
              locality: property.locality,
            }).limit(10);
          } catch {
            (err) => {
              next(err);
            };
          }
          let saved = null;
          if (req.isAuthenticated()) {
            saved = await Saved.findOne({
              $and: [
                { commercialID: property._id },
                { customerID: req.user._id },
              ],
            });
          }
          let issaved = false;
          if (saved) {
            issaved = true;
          }
          res.render("commercial-details", {
            savedetails: savedetails,
            property: property,
            issaved: issaved,
            similar: similarproperties,
            nearby: localityproperties,
          });
        } else {
          res.redirect("/404");
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});
module.exports.homePage = catchAsync(async(req, res, next) => {
  let residential = await Residential.aggregate(
   [{ $facet: {
    saleProperties : [{ $match: { $and: [{ isAvaliable: true }, { propertyFor: "Sale" }] } },{ $sample: { size: 6 } }],
    rentProperties : [{$match: { $and: [{ isAvaliable: true }, { propertyFor: "Rent/Lease" }] },},{ $sample: { size: 6 } }]
    }
  }]
  )
  let commercial = await Commercial.aggregate(
    [{ $facet: {
     saleProperties : [{ $match: { $and: [{ isAvaliable: true }, { propertyFor: "Sale" }] } },{ $sample: { size: 6 } }],
     rentProperties : [{$match: { $and: [{ isAvaliable: true }, { propertyFor: "Rent/Lease" }] },},{ $sample: { size: 6 } }]
     }
   }]
   )
  res.render("index", {
    saleproperties: residential[0].saleProperties,
    rentproperties: residential[0].rentProperties,
    salecommercial: commercial[0].saleProperties,
    rentcommercial: commercial[0].rentProperties,
  });
});
module.exports.search = catchAsync(async (req, res,next) => {
  let countofpage = 0;
  let filters = req.query;
  let conditions = [];
  conditions.push({ isAvaliable: true });
  if (filters.name) {
    conditions.push({ name: new RegExp(filters.name, "i") });
  }
  if (filters.locality) {
    conditions.push({ locality: filters.locality });
  }
  if (filters.status) {
    conditions.push({ "priceDetails.possessionStatus": filters.status });
  }
  if (filters.propertyfor) {
    conditions.push({ propertyFor: filters.propertyfor });
  }
  if (filters.propertytype) {
    conditions.push({ propertyType: filters.propertytype });
  }
  if (filters.furnishing) {
    conditions.push({
      "propertyFeatures.furnishingStatus": filters.furnishing,
    });
  }

  if (Array.isArray(filters.price)) {
    filters.price = filters.price[0] || filters.price[1];
  }
  if (filters.price) {
    let minpriceDetails = filters.price.split("-")[0].trim().split(" ");
    let minprice = 0;
    if (!minpriceDetails[1] || minpriceDetails[1].includes("+")) {
      minprice = parseInt(minpriceDetails[0]);
    } else if (minpriceDetails[1] == "Lac") {
      minprice = 100000 * parseInt(minpriceDetails[0]);
    } else if (minpriceDetails[1] == "Cr") {
      minprice = 10000000 * parseInt(minpriceDetails[0]);
    }
    let maxpriceDetails = null;
    let maxprice = 0;
    if (minpriceDetails[1] && minpriceDetails[1].includes("+")) {
      maxprice = 9990000000;
    } else {
      maxpriceDetails = filters.price.split("-")[1].trim().split(" ");
      if (!maxpriceDetails[1]) {
        maxprice = parseInt(maxpriceDetails[0]);
      } else if (maxpriceDetails[1] == "Lac") {
        maxprice = 100000 * parseInt(maxpriceDetails[0]);
      } else if (maxpriceDetails[1] == "Cr") {
        maxprice = 10000000 * parseInt(maxpriceDetails[0]);
      }
    }

    if (filters.propertyfor == "Sale") {
      conditions.push({ "priceDetails.expectedPrice": { $gte: minprice } });
      conditions.push({ "priceDetails.expectedPrice": { $lte: maxprice } });
    } else {
      conditions.push({ "priceDetails.expectedRent": { $gte: minprice } });
      conditions.push({ "priceDetails.expectedRent": { $lte: maxprice } });
    }
  }
  if (filters.sqmin) {
    conditions.push({ "propertyFeatures.carpetArea": { $gte: filters.sqmin } });
  }
  if (filters.sqmax) {
    conditions.push({ "propertyFeatures.carpetArea": { $lte: filters.sqmax } });
  }
  if (filters.bedrooms) {
    conditions.push({ "propertyFeatures.bedrooms": filters.bedrooms });
  }
  let condition = {};
  if (conditions.length) condition = { $and: conditions };
  let page = req.query.page || 1;
  let limit = 10;
  let skip = (page - 1) * limit;
  let conditionedProperties = await Residential.find(condition)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);
  countofpage = await Residential.countDocuments(condition);
  countofpage = parseInt(countofpage / 10);
  res.render("Search_page", { properties: conditionedProperties, page: countofpage });
});
module.exports.editProperty = (req, res, next) => {
  if (req.query.type == "residential") {
    Residential.findById(req.query._id).then((property) => {
      if (property) {
        let Quantity = ["", "", "", "", ""];
        let Furniture = [];
        if (property.propertyFeatures.furnitures)
          property.propertyFeatures.furnitures.forEach((furniture) => {
            Furniture.push(furniture.Type);
            if (furniture.Type == "Fan") {
              Quantity[0] = furniture.Quantity;
            } else if (furniture.Type == "Light") {
              Quantity[1] = furniture.Quantity;
            } else if (furniture.Type == "Bed") {
              Quantity[2] = furniture.Quantity;
            } else if (furniture.Type == "Wadrobe") {
              Quantity[3] = furniture.Quantity;
            } else if (furniture.Type == "Curtains") {
              Quantity[4] = furniture.Quantity;
            }
          });
        res.render("Create_property", {
          property: property,
          Furniture: Furniture,
          Quantity: Quantity,
        });
      } else res.redirect("/404");
    });
  } else {
    Commercial.findById(req.query._id).then((property) => {
      if (property) {
        res.render("commercial_property", { property: property });
      } else res.redirect("/404");
    });
  }
};
module.exports.searchCommercial = catchAsync(async (req, res, next) => {
  let filters = req.query;
  let conditions = [];
  conditions.push({ isAvaliable: true });
  if (filters.name) {
    conditions.push({ name: new RegExp(filters.name, "i") });
  }
  if (filters.locality) {
    conditions.push({ locality: filters.locality });
  }
  if (filters.status) {
    conditions.push({ possessionStatus: filters.status });
  }
  if (filters.propertyfor) {
    conditions.push({ propertyFor: filters.propertyfor });
  }
  if (filters.propertytype) {
    conditions.push({ propertyType: filters.propertytype });
  }
  if (Array.isArray(filters.price)) {
    filters.price = filters.price[0] || filters.price[1];
  }
  if (filters.price) {
    let minpriceDetails = filters.price.split("-")[0].trim().split(" ");
    let minprice = 0;
    if (!minpriceDetails[1] || minpriceDetails[1].includes("+")) {
      minprice = parseInt(minpriceDetails[0]);
    } else if (minpriceDetails[1] == "Lac") {
      minprice = 100000 * parseInt(minpriceDetails[0]);
    } else if (minpriceDetails[1] == "Cr") {
      minprice = 10000000 * parseInt(minpriceDetails[0]);
    }
    let maxpriceDetails = null;
    let maxprice = 0;
    if (minpriceDetails[1].includes("+")) {
      maxprice = 9990000000;
    } else {
      maxpriceDetails = filters.price.split("-")[1].trim().split(" ");
      if (!maxpriceDetails[1]) {
        maxprice = parseInt(maxpriceDetails[0]);
      } else if (maxpriceDetails[1] == "Lac") {
        maxprice = 100000 * parseInt(maxpriceDetails[0]);
      } else if (maxpriceDetails[1] == "Cr") {
        maxprice = 10000000 * parseInt(maxpriceDetails[0]);
      }
    }

    if (filters.propertyfor == "Sale") {
      conditions.push({ expectedPrice: { $gte: minprice } });
      conditions.push({ expectedPrice: { $lte: maxprice } });
    } else {
      conditions.push({ expectedRent: { $gte: minprice } });
      conditions.push({ expectedRent: { $lte: maxprice } });
    }
  }
  if (filters.sqmin) {
    conditions.push({ "areaDetails.carpetArea": { $gte: filters.sqmin } });
  }
  if (filters.sqmax) {
    conditions.push({ "areaDetails.carpetArea": { $lte: filters.sqmax } });
  }
  let properties = [];
  let condition = {};
  if (conditions.length) condition = { $and: conditions };
  let page = req.query.page || 1;
  let limit = 10;
  let skip = (page - 1) * limit;
  let conditionedProperties = await Commercial.find(condition)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);
  countofpage = await Commercial.countDocuments(condition);
  countofpage = parseInt(countofpage / 10);
  conditionedProperties.forEach((element) => {
    property = {};
    element.Images.images.forEach((img) => {
      if (img.includes("CoverImages")) {
        property.image = img;
      }
    });
    property.id = element.id;

    property.type = element.propertyType;

    property.title =
      element.propertyType +
      " For " +
      element.propertyFor +
      " at " +
      element.name +
      ", " +
      element.locality;
    property.area = element.areaDetails.carpetArea;
    if (
      element.possessionStatus == "Under Construction" &&
      element.propertyFor == "Sale"
    ) {
      property.status = element.possessionStatus;
      "Possession by " +
        element.avaliableFrom.month +
        " " +
        element.avaliableFrom.year;
    } else if (element.propertyFor == "Sale") {
      property.status =
        element.possessionStatus + ", " + element.ageOfConstruction;
    } else {
      property.status = "Ready to Move";
    }
    property.price = element.expectedPrice || element.expectedRent;
    properties.push(property);
  });
res.render("commercial_search", {
  properties: conditionedProperties,
  page: countofpage,
});
});
module.exports.createProperty = catchAsync(async (req, res, next) => {
  let property = req.body;
  property.propertyFeatures = {};
  property.propertyFeatures.bedrooms = req.body.Bedrooms;
  property.propertyFeatures.bedroomArea = [];
  for (let i = 0; i < req.body.Bedrooms; i++) {
    property.propertyFeatures.bedroomArea.push({
      lenght: req.body["lenght" + i],
      breadth: req.body["breadth" + i],
    });
  }

  if (req.body.superBuiltUpArea[0] != "")
    property.propertyFeatures.superBuiltUpArea = convertToSq(
      req.body.superBuiltUpArea[0],
      req.body.superBuiltUpArea[1]
    );
  if (req.body.builtUpArea[0] != "")
    property.propertyFeatures.builtUpArea = convertToSq(
      req.body.builtUpArea[0],
      req.body.builtUpArea[1]
    );
  property.propertyFeatures.carpetArea = convertToSq(
    req.body.carpetArea[0],
    req.body.carpetArea[1]
  );

  property.propertyFeatures.balconies = req.body.Balconies[0]||req.body.Balconies[1];
  property.propertyFeatures.bathroom = req.body.bathroom;
  property.propertyFeatures.floorNo = req.body.floorNo;
  property.propertyFeatures.totalFloors = req.body.totalFloors;
  property.propertyFeatures.furnishingStatus = req.body.furnishingStatus;
  property.propertyFeatures.flatsOnFloor = req.body.flatsOnFloor;
  property.propertyFeatures.furnitures = [];
  if (req.body.furniture && !Array.isArray(req.body.furniture)) {
    req.body.furniture = [req.body.furniture];
  }
  if (req.body.furniture)
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
  if (property.propertyFor == "Rent/Lease") {
    property.priceDetails.expectedRent = req.body.expectedRent;
    property.priceDetails.securityDeposit = req.body.securityDeposit;
    property.priceDetails.rentBrokerage = req.body.rentBrokerage;
  }
  if (property.propertyFor == "Sale") {
    property.priceDetails.possessionStatus = req.body.possessionStatus;
    if (property.priceDetails.possessionStatus == "Under Construction") {
      property.priceDetails.avaliableFrom = {};
      property.priceDetails.avaliableFrom.month = req.body.month;
      property.priceDetails.avaliableFrom.year = req.body.year;
    } else if (property.priceDetails.possessionStatus == "Ready to Move") {
      property.priceDetails.ageOfConstruction = req.body.ageOfConstruction;
    }
  }
  property.priceDetails.priceType = req.body.priceType;
  property.priceDetails.maintaninceCharge = req.body.maintaninceCharge;
  property.priceDetails.maintaninceChargeType = req.body.maintaninceChargeType;
  property.priceDetails.priceIncludes = req.body.priceIncludes;
  property.priceDetails.stampDutyCharges = req.body.stampDutyCharges
    ? req.body.stampDutyCharges
    : false;
  property.additionalFeatures = {};
  property.additionalFeatures.additonalRooms = req.body.additonalRooms;
  property.additionalFeatures.facing = req.body.facing;
  property.additionalFeatures.overlooking = req.body.overlooking;
  property.additionalFeatures.carParking = req.body.carParking;
  property.additionalFeatures.liftsInTheTower = req.body.liftsInTheTower;
  property.additionalFeatures.multipleUnitsAvaliable =
    req.body.multipleUnitsAvaliable || false;
  if (property.additionalFeatures.multipleUnitsAvaliable) {
    property.additionalFeatures.unitQuantity = req.body.unitQuantity;
  }
  property.statusOfWaterandElectric = {};
  property.statusOfWaterandElectric.avaliablityOfWater =
    req.body.avaliablityOfWater;
  property.statusOfWaterandElectric.avaliablityOfElectricity =
    req.body.avaliablityOfElectricity;

  property.ownershipAndApproval = {};
  property.ownershipAndApproval.ownershipStatus = req.body.ownershipStatus;
  property.ownershipAndApproval.approvedBy = req.body.approvedBy;

  property.flooring = req.body.flooring;
  property.amenities = req.body.amenities;
  property.description = req.body.description;
  property.landmarks = req.body.landmarks;
  if (!req.body._id) {
    let imagesArray = [];
    let i = 0;
    const images = req.files;
    let optimizeimages = [];
    const imageid = nanoid();
    await Promise.all(
      images.map(async (image) => {
        const newimage = {};
        newimage.fieldname = image.fieldname;
        newimage.originalname =
          image.originalname.substr(0, image.originalname.lastIndexOf(".")) +
          ".webp";
        newimage.buffer = await sharp(image.buffer)
          .toFormat("webp")
          .jpeg({ quality: 90 })
          .toBuffer();
        optimizeimages.push(newimage);
      })
    );

    await Promise.all(
      optimizeimages.map(async (image) => {
        await firebase.uploadFile(image, imageid, i++).then((result) => {
          imagesArray.push(result);
        });
      })
    );
    property.Images = {};
    property.Images.images = imagesArray;
    property.Images.imageid = imageid;
  }
  if (req.body._id) {
    Residential.findByIdAndUpdate(req.body._id, property)
      .catch((err) => {
        next(err);
      })
      .then((result) => {
        req.flash(flashSuccess, "Property has been Edited");
        if (result) res.redirect("/admin/admindashboard");
      });
  } else {
    Residential.create(cleanObject(property))
      .catch((err) => {
        next(err);
      })
      .then((result) => {
        req.flash(flashSuccess, "Property has been Added");
        if (result) res.redirect("/admin/admindashboard");
      });
  }
});
module.exports.commercialProperty = catchAsync(async (req, res, next) => {
  let commercial = req.body;
  commercial.areaDetails = {};
  if (req.body.superBuiltUpArea[0] != "")
    commercial.areaDetails.superBuiltUpArea = convertToSq(
      req.body.superBuiltUpArea[0],
      req.body.superBuiltUpArea[1]
    );
  if (req.body.builtUpArea[0] != "")
    commercial.areaDetails.builtUpArea = convertToSq(
      req.body.builtUpArea[0],
      req.body.builtUpArea[1]
    );
  commercial.areaDetails.carpetArea = convertToSq(
    req.body.carpetArea[0],
    req.body.carpetArea[1]
  );
  if(req.body.propertyType=='Commercial Shop'||req.body.propertyType=='Commercial Showroom')
  commercial.balconies = commercial.balconies[0]||commercial.balconies[1]
  if (req.body.PropertyType == "Commercial Office Space") {
    commercial.officeSetup = {};
    commercial.officeSetup.minSeats = req.body.minSeats;
    commercial.officeSetup.maxSeats = req.body.maxSeats;
    commercial.officeSetup.noOfCabins = req.body.noOfCabins;
    commercial.officeSetup.noOfMeetingRooms = req.body.noOfMeetingRooms;
    commercial.conferenceRoom = req.body.conferenceRoom || false;
    commercial.receptionArea = req.body.receptionArea || false;
    commercial.pantryType = {};
    commercial.pantryType.pantryTypes = req.body.pantryTypes;
    commercial.pantryType.pantrySize = req.body.pantrySize;
  }
  if (req.body.WashroomisAvaliable) {
    commercial.washrooms = {};
    commercial.washrooms.isAvaliable = req.body.WashroomisAvaliable;
    commercial.washrooms.quantity = req.body.quantity;
  }
  commercial.floorDetails = {};
  commercial.floorDetails.totalFloors = req.body.totalFloors;
  commercial.floorDetails.yourFloor = req.body.yourFloor;
  commercial.floorDetails.noOfStaircases = req.body.noOfStaircases;
  commercial.lifts = {};
  commercial.lifts.isAvaliable = req.body.liftisAvaliable || false;
  if (commercial.lifts.isAvaliable) {
    commercial.lifts.passengerLifts = req.body.passengerLifts;
    commercial.lifts.serviceLifts = req.body.serviceLifts;
  }
  commercial.brokerage = {};
  commercial.brokerage.brokerageType = req.body.brokerageType;
  if (commercial.brokerage.brokerageType == "Percentage")
    commercial.brokerage.percentageBrokerage = req.body.percentageBrokerage;
  else commercial.brokerage.fixedBrokerage = req.body.fixedBrokerage;
  if (commercial.propertyFor == "Sale") {
    commercial.expectedPrice = req.body.expectedPrice;
    commercial.saleBrokerage = req.body.saleBrokerage;
    commercial.bookingAmount = req.body.bookingAmount;
    commercial.transactionType = req.body.transactionType;
  }
  if (commercial.propertyFor == "Rent/Lease") {
    commercial.expectedRent = req.body.expectedRent;
    commercial.securityDeposit = req.body.securityDeposit;
    commercial.rentBrokerage = req.body.rentBrokerage;
  }
  if (commercial.propertyFor == "Sale") {
    commercial.possessionStatus = req.body.possessionStatus;
    if (commercial.possessionStatus == "Under Construction") {
      commercial.avaliableFrom = {};
      commercial.avaliableFrom.month = req.body.month;
      commercial.avaliableFrom.year = req.body.year;
    } else if (commercial.possessionStatus == "Ready to Move") {
      commercial.ageOfConstruction = req.body.ageOfConstruction;
    }
  }
  if (!req.body._id) {
    let imagesArray = [];
    let i = 0;
    const images = req.files;
    let optimizeimages = [];
    const imageid = nanoid();
    await Promise.all(
      images.map(async (image) => {
        const newimage = {};
        newimage.fieldname = image.fieldname;
        newimage.originalname =
          image.originalname.substr(0, image.originalname.lastIndexOf(".")) +
          ".webp";
        newimage.buffer = await sharp(image.buffer)
          .toFormat("webp")
          .jpeg({ quality: 90 })
          .toBuffer();
        optimizeimages.push(newimage);
      })
    );
    await Promise.all(
      optimizeimages.map(async (image) => {
        await firebase.uploadFile(image, imageid, i++).then((result) => {
          imagesArray.push(result);
        });
      })
    );
    commercial.Images = {};
    commercial.Images.images = imagesArray;
    commercial.Images.imageid = imageid;

    Commercial.create(cleanObject(commercial))
      .catch((err) => {
        next(err);
      })
      .then((result) => {
        if (result) {
          req.flash(flashSuccess, "Property has been Added");
          res.redirect("/admin/admindashboard")
        };
      });
  } else {
    Commercial.findByIdAndUpdate(req.body._id, commercial)
      .catch((err) => {
        next(err);
      })
      .then((result) => {
        if (result) {
          req.flash(flashSuccess, "Property has been Added");
          res.redirect("/admin/admindashboard")
        }
        else res.redirect("/404");
      });
  }
});
