const Commercial = require("../Models/Commercial");
const Enquiry = require("../Models/Enquiry");
const Residental = require("../Models/Residental");
const Saved = require("../Models/Saved");
const User = require("./../Models/User");
const firebase = require("./../Utils/firebaseAdminInit");
const flashSuccess = "success";
const converttocardData = (Data) => {
  Data.forEach((element) => {
    property = {};
    element.Images.images.forEach((img) => {
      if (img.includes("CoverImages")) {
        property.image = img;
      }
    });
    property.title =
      element.propertyType +
      " For " +
      element.propertyFor +
      " at " +
      element.name +
      ", " +
      element.locality;
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
};
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports.AdminDashboard = catchAsync(async (req, res, next) => {
  const Page = req.query.page || 1;
  const limit = req.query.limit * 1 || 14;
  const skip = (Page - 1) * limit;
  let saved = {};
  if (req.query.number) {
    let user = await User.findOne({ phone: req.query.number });
    saved = await Saved.find({ customerID: user._id }).populate({
      path: "residentalID commercialID",
      select: "propertyType propertyFor name locality furnishing description",
    });
  }
  let commercialresult = await Commercial.aggregate([
    {
      $facet: {
        ActivatedProperty: [
          {
            $match: {
              isAvaliable: true,
            },
          },
          {
            $project: {
              title: {
                $concat: [
                  "$propertyType",
                  " For ",
                  "$propertyFor",
                  " at ",
                  "$name",
                  ",",
                  "$locality",
                ],
              },
              isAvaliable: 1,
              address: 1,
              createdAt: 1,
              expectedPrice: 1,
              expectedRent: 1,
              "areaDetails.carpetArea": 1,
            },
          },
          { $sort: { _id: -1 } },
        ],
        DisabledProperty: [
          {
            $match: {
              isAvaliable: false,
            },
          },
          {
            $project: {
              title: {
                $concat: [
                  "$propertyType",
                  " For ",
                  "$propertyFor",
                  " at ",
                  "$name",
                  ",",
                  "$locality",
                ],
              },
              isAvaliable: 1,
              address: 1,
              createdAt: 1,
              expectedPrice: 1,
              expectedRent: 1,
              "areaDetails.carpetArea": 1,
            },
          },
          { $sort: { _id: -1 } },
        ],
        AllProperty: [
          {
            $match: { $or: [{ isAvaliable: true }, { isAvaliable: false }] },
          },
          {
            $project: {
              title: {
                $concat: [
                  "$propertyType",
                  " For ",
                  "$propertyFor",
                  " at ",
                  "$name",
                  ",",
                  "$locality",
                ],
              },
              isAvaliable: 1,
              address: 1,
              createdAt: 1,
              expectedPrice: 1,
              expectedRent: 1,
              "areaDetails.carpetArea": 1,
            },
          },
          { $sort: { _id: -1 } },
        ],
      },
    },
  ]);
  let residentalresult = await Residental.aggregate([
    {
      $facet: {
        ActivatedProperty: [
          {
            $match: {
              isAvaliable: true,
            },
          },
          {
            $project: {
              title: {
                $concat: [
                  "$propertyType",
                  " For ",
                  "$propertyFor",
                  " at ",
                  "$name",
                  ",",
                  "$locality",
                ],
              },
              isAvaliable: 1,
              address: 1,
              createdAt: 1,
              "priceDetails.expectedPrice": 1,
              "priceDetails.expectedRent": 1,
              "propertyFeatures.carpetArea": 1,
            },
          },
          { $sort: { _id: -1 } },
        ],
        DisabledProperty: [
          {
            $match: {
              isAvaliable: false,
            },
          },
          {
            $project: {
              title: {
                $concat: [
                  "$propertyType",
                  " For ",
                  "$propertyFor",
                  " at ",
                  "$name",
                  ",",
                  "$locality",
                ],
              },
              isAvaliable: 1,
              address: 1,
              createdAt: 1,
              "priceDetails.expectedPrice": 1,
              "priceDetails.expectedRent": 1,
              "propertyFeatures.carpetArea": 1,
            },
          },
          { $sort: { _id: -1 } },
        ],
        AllProperty: [
          {
            $match: {
              $or: [{ isAvaliable: true }, { isAvaliable: false }],
            },
          },
          {
            $project: {
              title: {
                $concat: [
                  "$propertyType",
                  " For ",
                  "$propertyFor",
                  " at ",
                  "$name",
                  ",",
                  "$locality",
                ],
              },
              isAvaliable: 1,
              address: 1,
              createdAt: 1,
              "priceDetails.expectedPrice": 1,
              "priceDetails.expectedRent": 1,
              "propertyFeatures.carpetArea": 1,
            },
          },
          { $sort: { _id: -1 } },
        ],
      },
    },
  ]);
  let customer = await User.find({ isAdmin: false }).sort({ _id: -1 });
  let enquiries = await Enquiry.find({ contacted: false });
  let enquiries_count = await Enquiry.find({
    contacted: false,
  }).countDocuments();
  let enquiries_solved = await Enquiry.find({
    contacted: true,
  }).countDocuments();
  res.render("adminDashboard", {
    customer: customer,
    commercial: commercialresult,
    properties: residentalresult,
    enquiries: enquiries,
    unsolved: enquiries_count,
    solved: enquiries_solved,
    saved: saved,
  });
});

module.exports.TogglePropertyAvaliablity = catchAsync((req, res, next) => {
  if (req.body.type == "commercial") {
    Commercial.findByIdAndUpdate(req.body.id, { isAvaliable: req.body.status })
      .then((property) => {
        if (req.body.status == "true") {
          req.flash(flashSuccess, "Property has ben Activated");
        } else {
          req.flash(flashSuccess, "Property has been Deactived");
        }
        res.redirect("/admin/admindashboard");
      })
      .catch((err) => {
        next(err);
      });
  } else {
    Residental.findByIdAndUpdate(req.body.id, { isAvaliable: req.body.status })
      .then((property) => {
        if (req.body.status == "true") {
          req.flash(flashSuccess, "Property has ben Activated");
        } else {
          req.flash(flashSuccess, "Property has been Deactived");
        }
        res.redirect("/admin/admindashboard");
      })
      .catch((err) => {
        next(err);
      });
  }
});

module.exports.DeletePropertyAvaliablity = catchAsync((req, res, next) => {
  if (req.body.type == "commercial") {
    Commercial.findById(req.body.id)
      .then((result) => {
        firebase.deleteFile(result.Images.images);
        Saved.remove({ residentalID: req.body.id });
        Commercial.findByIdAndDelete(req.body.id).then((deleted) => {
          req.flash(flashSuccess, "Property Has Been Removed");
          res.redirect("/admin/admindashboard");
        });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } else {
    Residental.findById(req.body.id)
      .then((result) => {
        firebase.deleteFile(result.Images.images);
        Saved.remove({ residentalID: req.body.id });
        Residental.findByIdAndDelete(req.body.id).then((deleted) => {
          req.flash(flashSuccess, "Property Has Been Removed");
          res.redirect("/admin/admindashboard");
        });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }
});

module.exports.MarkQuerySolved = catchAsync((req, res,next) => {
  Enquiry.findByIdAndUpdate(req.body.id, { contacted: true }).then((saved) => {
    req.flash(flashSuccess, "Enquiry Has Been Solved");
    res.redirect("/admin/admindashboard");
  });
});
