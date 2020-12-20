const mongoose = require('mongoose');
const PropertySchema = mongoose.Schema({
isAvaliable : {
type : Boolean,
required : true,
default : true
},
propertyType : {
    type : String,
    enum : ['Flat/Apartment','Residential House','Villa','Builder Floor Apartment','Penthouse','Studio Apartment','Commercial Shop','Commercial Office Space','Commercial Showroom','Warehouse/Godows','Industrial Shed','Land','Farm House'],
    required : true,
},
propertyFor : {
    type : String,
    enum :['Sale','Rent/Lease','PG/Hostel'],
    required : true
},
locality : {
    type : String,
    enum : ['Roadpali','Kalamboli','Khargahar'],
    required : true
},
propertyFeatures : {
    superBuiltUpArea : {
        type : String,
    },
    builtUpArea : {
        type : String
    },
    carpetArea : {
        type : String,
    },
    bedrooms : {
        type : String,
        enum : ["0","1","2","3","4","More Than 4"],
        required : true
    },
    bedroomArea :[{
        lenght : {
            type : Number,
            required : true
        },
        breadth : {
            type : Number,
            required : true
        }
    }],
    balconies :{
        type : String,
        enum : ["0","1","2","3","4","More Than 4"],
        required : true
    },
    bathroom :{
        type : String,
        enum : ["0","1","2","3","More Than 3"],
        required : true
    },
    floorNo : {
        type : Number,
        required : true
    },
    totalFloors : {
        type : Number,
        required : true
    },
    flatsOnFloor : {
        type : Number,
        required : true
    },
    furnishingStatus :{
        type : String,
        enum : ["Furnished","Unfurnished","Semi-Furnished"],
        required : true
    },
    furnitures :[{
        Type : {
        type : String,
        enum : ['TV','TV unit','Sofa','Dining Table','Fan.','Light.','Modular Kitchen','Chimney','Microwave','Fridge','Washingmachine','Bed.','Wadrobe.','Curtains.',],
        required : true
        },
        Quantity : {
            type : Number
        }
    }]

},

priceDetails :{
    expectedPrice :{
        type : String,
        required : function(){return this.propertyFor=='Sale'}
    },
    // Calcualte Price per sq in frontend
    bookingAmount : {
        type : String,
        required : function(){ return this.propertyFor=='Sale'}
    },
    expectedRent : {
        type : String,
        required : function(){ return this.propertyFor=='Rent/Lease'}
    },
    securityDeposit : {
        type : String,
        required : function(){ return this.propertyFor=='Rent/Lease'}
    },
    transactionType : {
        type : String,
        enum : ['New Property','Resale'],
        required : function(){ return this.propertyFor=='Sale'}
    },
    possessionStatus : {
        type : String,
        enum : ['Under Construction','Ready to Move'],
        required : function(){return this.propertyFor=='Sale' && this.priceDetails.transactionType=='New Property'}
    },
    avaliableFrom :{
        month :{
            type : String,
            enum : ["January"],
            required : function(){return this.priceDetails.possessionStatus=='Under Construction'}
        },
        year :{
            type : Number,
            required : function(){return this.priceDetails.possessionStatus=='Under Construction'}
        }
    },
    ageOfConstruction : {
        type : String,
        enum : ['New Construction','Less than 5 years','5 to 10 years','10 to 15 years','15 to 20 years','Above 20 years'],
        required : function(){return this.priceDetails.possessionStatus=='Ready to Move'}
    },
    priceType :{
        type : String,
        enum : ["Fixed","Negotiable","Call for Price"],
        required : true
    },
    maintaninceCharge : {
        type : String,
        required : true
    },
    maintaninceChargeType : {
        type : String,
        enum : ['Monthly','Quaterly','One Time','Per sq. Unit Monthly'],
        required : true
    },
    priceIncludes : {
        type : [String],
        enum : ['PCL','Car Parking','Club Membership'],
    },
    stampDutyCharges : {
        type : Boolean,
        required : true
    },
    tokenAmount : {
        type : String,
        required : false,
        default: "0"
    },
    saleBrokerage : {
        type : String,
        enum : ['No Brokerage','0.25%','0.5%','0.75%','1%','1.5%','2%','3%','4%'],
        required :  function(){return this.propertyFor=='Sale'}
    },
    rentBrokerage : {
        type : String,
        enum : ['No Brokerage','30 Days','45 Days','60 Days'],
        required : function(){return this.propertyFor=='Rent'}
    }

},

additionalFeatures : {
additonalRooms : {
    type : [String],
    enum : ['Puja Room','Study Room','Store Room','Servant Room','None of these'],
    required : true
},
facing :{
    type : String,
    enum : ['North','East','West','South','North-West','North-East','South-West','South-East'],
    required : true
},
overlooking : {
    type : [String],
    enum : ['Garden/Park','Pool','Main Road','Not Availiable'],
    required : true
},
carParking : {
    type : String,
    enum : ['Covered','Open','None'],
    required : true
},
liftsInTheTower : {
    type : Number,
    enum : ['1','2','3','4','4+'],
    required : true
},
multipleUnitsAvaliable : {
    type : Boolean,
    required  : true
}
},
statusOfWaterandElectric : {
avaliablityOfWater :{
    type :  String,
    enum :['24 Hours Avaliable','12 Hours Avaliable','6 Hours Avaliable','2 Hours Avaliable','1 Hours Avaliable'],
    required : true
},
avaliablityOfElectricity :{
    type :  String,
    enum :['24 Hours Avaliable','12 Hours Avaliable','6 Hours Avaliable','2 Hours Avaliable','1 Hours Avaliable'],
    required : true
}
},
ownershipAndApproval : {
    ownershipStatus : {
        type : String,
        enum : ['Freehold','Leasehold','Power Of Attorney','Co-operative Society'],
        required : true
    },
    // approvedBy : {
    //     type : String,
    //     enum : ['','','Power Of Attorney','Co-operative Society'],
    //     required : true
    // }
},
flooring : [{
type : String,
enum : ['Ceramic Tiles','Granite','Marble','Marbonite','Mosaic','Normal Tiles/Kotha Stone','Vitrified','Wooden'],
required : true
}],
amenities : {
type : [String],
enum : ['Air Conditioned','Banquet Hall','Bar/Lounge','Cafeteria/Food Court','Club House','Conference Room','DTH Television Facility','Gymnasium','Intercom Facility','Internet/Wi-Fi Connectivity','Jogging and Strolling Track','Laundry Service','Lift','Maintenance Staff','Outdoor Tennis Courts','Park','Piped Gas','Power Back Up','Private Terrace/Garden','RO Water System','Rain Water Harvesting','Reserved Parking','Security','Service/Goods Lift','Swimming Pool','Vaastu Compliant','Visitor Parking','Waste Disposal','Water Storage'],
},
description : {
    type  : String,
    required : true
},
landmarks : {
    type  : String,
    required : true
},
// images :{
//     exteriorView : [{
//         type : String,
//         required : true
//     }],
//     livingRoom : [{
//         type : String,
//         required : true
//     }],
//     bedrooms : [{
//         type : String,
//         required : true
//     }],
//     kitchen : [{
//         type : String,
//         required : true
//     }],
//     floorPlan : [{
//         type : String,
//         required : true
//     }],
//     masterPlan : [{
//         type : String,
//         required : true
//     }],
//     locationMap : [{
//         type : String,
//         required : true
//     }],
//     other : [{
//         type : String,
//         required : true
//     }]
// } 
images  : {
    type  : [String],
    required : true
}
},{
    timestamps: true,
});

const Property = mongoose.model('Property',PropertySchema);
module.exports = Property;

//Add map soon