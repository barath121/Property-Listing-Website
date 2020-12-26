const Property = require("../Models/Property");
const Commercial = require("../Models/Commercial");
const firebase = require("./../Utils/firebaseAdminInit");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 15);
const converttosq = (area, unit) => {
  if (unit == "Sqft") {
    return area;
  } else if (unit == "Acre") {
    return area * 43560;
  } else if (unit == "Sq-M") {
    return area * 10.7639;
  } else return area;
};
module.exports.test = (req, res) => {
  res.render("Create_property");
};
module.exports.createProperty = async (req, res, next) => {
  const body = req.body;
  console.log(req.body);

  let property = {};
  property.name = req.body.name;
  property.address = req.body.address;
  property.propertyType = req.body.PropertyType;
  property.propertyFor = req.body.Propertyfor;
  property.locality = req.body.Locality;
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
    property.propertyFeatures.superBuiltUpArea = converttosq(
      req.body.superBuiltUpArea[0],req.body.superBuiltUpArea[1]
    );
  if (req.body.builtUpArea[0] != "")
    property.propertyFeatures.builtUpArea = converttosq(
      req.body.builtUpArea[0],req.body.builtUpArea[1]
    );
  property.propertyFeatures.carpetArea = converttosq(req.body.carpetArea[0],req.body.carpetArea[1]);

  property.propertyFeatures.balconies = req.body.Balconies;
  property.propertyFeatures.bathroom = req.body.bathroom;
  property.propertyFeatures.floorNo = req.body.floorNo;
  property.propertyFeatures.totalFloors = req.body.totalFloors;
  property.propertyFeatures.furnishingStatus = req.body.furnishingStatus;
  property.propertyFeatures.flatsOnFloor = req.body.flatsOnFloor;
  console.log(req.body.furniture);
  property.propertyFeatures.furnitures = [];
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
  property.priceDetails.tokenAmount = req.body.tokenAmount;

  property.additionalFeatures = {};
  property.additionalFeatures.additonalRooms = req.body.additonalRooms;
  property.additionalFeatures.facing = req.body.facing;
  property.additionalFeatures.overlooking = req.body.overlooking;
  property.additionalFeatures.carParking = req.body.carParking;
  property.additionalFeatures.liftsInTheTower = req.body.liftsInTheTower;
  property.additionalFeatures.multipleUnitsAvaliable =
    req.body.multipleUnitsAvaliable;
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
  let imagesArray = [];
  let i = 0;
  const images = req.files;
  const imageid = nanoid();
  console.log(req.files);
  await Promise.all(
    images.map((image) =>
      firebase.uploadFile(image, imageid, i++).then((result) => {
        imagesArray.push(result);
      })
    )
  );
  property.Images = {};
  property.Images.images = imagesArray;
  property.Images.imageid = imageid;

  Property.create(property)
    .catch((err) => {
      console.log(err);
      next(err);
    })
    .then((result) => {
      if (result) res.redirect("/");
    });
};
module.exports.ViewProperty = (req, res) => {
  let id = req.query.id;
  let type = req.query.type;
  if (type == "residential") {
    Property.findById(id)
      .then((property) => {
        res.render("property-detail", { property: property });
      })
      .catch((err) => {
        next(err);
      });
  }
};
module.exports.HomePage = async (req, res) => {
  let Properties = await Property.aggregate([
    { $sample: { size: 6 } },
  ]).catch((err) => next(err));
  properties = [];
  Properties.forEach((element) => {
    property = {};
    console.log(element.locality);
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
  console.log(properties)
  res.render("index", { property: properties });
};
module.exports.Search = async (req, res) => {
  let filters = req.query;
  let conditions = [];
  if (filters.name) {
    conditions.push({ name: new RegExp(filters.name, "i") });
  }
  if (filters.locality) {
    conditions.push({ locality: filters.locality });
  }
  if (filters.status) {
    conditions.push({ "priceDetails.possessionStatus": filters.status });
  }
  if (filters.type) {
    conditions.push({ propertyFor: filters.type });
  }
  if (filters.propertytype) {
    conditions.push({ propertyType: filters.propertytype });
  }
  if (filters.furnishing) {
    conditions.push({
      "propertyFeatures.furnishingStatus": filters.furnishing,
    });
  }
  if (filters.price) {
    console.log(filters.price);
    let minpriceDetails = filters.price.split("-")[0].trim().split(" ");
    let minprice = 0;
    if (!minpriceDetails[1]) {
      minprice = parseInt(minpriceDetails[0]);
    } else if (minpriceDetails[1] == "Lac") {
      minprice = 100000 * parseInt(minpriceDetails[0]);
    } else if (minpriceDetails[1] == "Cr") {
      minprice = 10000000 * parseInt(minpriceDetails[0]);
    }
    let maxpriceDetails = filters.price.split("-")[1].trim().split(" ");
    let maxprice = 0;
    console.log(maxpriceDetails);
    if (!maxpriceDetails[1]) {
      maxprice = parseInt(maxpriceDetails[0]);
    } else if (maxpriceDetails[1] == "Lac") {
      maxprice = 100000 * parseInt(maxpriceDetails[0]);
    } else if (maxpriceDetails[1] == "Cr") {
      maxprice = 10000000 * parseInt(maxpriceDetails[0]);
    }
    conditions.push({ "priceDetails.expectedPrice": { $gt: minprice } });
    conditions.push({ "priceDetails.expectedPrice": { $lt: maxprice } });
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
  let properties = [];
  if (conditions.length) {
    let condition = { $and: conditions };
    console.log(condition);
    properties = await Property.find(condition);
  }
  // console.log(properties[0]._id);
  res.render("Search_page",{properties : properties});
};
module.exports.CommercialProperty = (req, res) => {
  console.log(req.body);
};
