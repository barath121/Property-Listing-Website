const Commercial = require("../Models/Commercial");
const Enquiry = require("../Models/Enquiry");
const Residential = require("../Models/Residential");
const Saved = require("../Models/Saved");
const User = require("./../Models/User");
const firebase = require("./../Utils/firebaseAdminInit");
const flashSuccess = "success";
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

module.exports.adminDashboard = catchAsync(async (req, res, next) => {
  const Page = req.query.page || 1;
  const limit = req.query.limit * 1 || 14;
  const skip = (Page - 1) * limit;
  let saved = {};
  if (req.query.number) {
    let user = await User.findOne({ phone: req.query.number });
    saved = await Saved.find({ customerID: user._id }).populate({
      path: "residentialID commercialID",
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
  let residentialresult = await Residential.aggregate([
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
    properties: residentialresult,
    enquiries: enquiries,
    unsolved: enquiries_count,
    solved: enquiries_solved,
    saved: saved,
  });
});

module.exports.togglePropertyAvaliablity = catchAsync(async(req, res, next) => {
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
    Residential.findByIdAndUpdate(req.body.id, { isAvaliable: req.body.status })
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

module.exports.deleteProperty = catchAsync(async(req, res, next) => {
  if (req.body.type == "commercial") {
    Commercial.findById(req.body.id)
      .then((result) => {
        firebase.deleteFile(result.Images.images);
        Saved.remove({ residentialID: req.body.id });
        Commercial.findByIdAndDelete(req.body.id).then((deleted) => {
          req.flash(flashSuccess, "Property Has Been Removed");
          res.redirect("/admin/admindashboard");
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    Residential.findById(req.body.id)
      .then((result) => {
        firebase.deleteFile(result.Images.images);
        Saved.remove({ residentialID: req.body.id });
        Residential.findByIdAndDelete(req.body.id).then((deleted) => {
          req.flash(flashSuccess, "Property Has Been Removed");
          res.redirect("/admin/admindashboard");
        });
      })
      .catch((err) => {
        next(err);
      });
  }
});

module.exports.markQuerySolved = catchAsync(async(req, res,next) => {
  Enquiry.findByIdAndUpdate(req.body.id, { contacted: true }).then((saved) => {
    req.flash(flashSuccess, "Enquiry Has Been Solved");
    res.redirect("/admin/admindashboard");
  });
});
