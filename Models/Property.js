const mongoose = require('mongoose');
const PropertySchema = mongoose.Schema({
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
Locality : {
    type : String,
    enum : ['Roadpali','Kalamboli','Khargahar'],
    required : true
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
        required : function(){ return this.propertyFor!='Sale'}
    },
    securityDeposit : {
        type : String,
        required : function(){ return this.propertyFor=='Rent'}
    },
    transactionType : {
        type : String,
        enum : ['New Property','Resale'],
        required : function(){ return this.propertyFor=='Sale'}
    },
    possessionStatus : {
        type : String,
        enum : ['Under Construction','Ready to Move'],
        required : function(){return this.propertyFor=='Sale'}
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
        enum : ['Monthly','Quaterly','Yearly','One Time','Per sq. Unit Monthly'],
        required : true
    },
    priceIncludes : [{
        type : String,
        enum : ['PCL','Car Parking','Club Membership'],
    }],
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
images :{
    exteriorView : [{
        type : String,
        required : true
    }],
    livingRoom : [{
        type : String,
        required : true
    }],
    bedrooms : [{
        type : String,
        required : true
    }],
    kitchen : [{
        type : String,
        required : true
    }],
    floorPlan : [{
        type : String,
        required : true
    }],
    masterPlan : [{
        type : String,
        required : true
    }],
    locationMap : [{
        type : String,
        required : true
    }],
    other : [{
        type : String,
        required : true
    }],
} 
});

const Property = mongoose.model('Property',PropertySchema);
module.exports = Property;