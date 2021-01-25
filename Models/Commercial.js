const mongoose = require('mongoose');
const CommercialSchema = mongoose.Schema({
isAvaliable : {
type : Boolean,
required : true,
default : true
},
Type : {
    type  : String,
    default : "commercial"
},
name :{
    type : String,
    required : true
},
address : {
    type : String,
    required : true
},
propertyType : {
    type : String,
    enum : ['Commercial Shop','Commercial Office Space','Commercial Showroom','Warehouse/Godows','Industrial Shed'],
    required : true,
},
propertyFor : {
    type : String,
    enum :['Sale','Rent/Lease','PG/Hostel'],
    required : true
},
locatedInside : {
 type : String,
 enum : ['IT Park','Business Park','Other'],
 required : true
},
zoneType : {
type : String,
enum : ['Industrial','Commercial','Residential','Transport and Communication','Public Utilities','Public and Semi Public Use','Open Spaces','Agricultural Zone','Special Economic Zone','Natural Conservation Zone','Natural Conservation Zone','Government Use','Other'],
required : true
},
areaDetails : {
    superBuiltUpArea : {
        type : String,
    },
    builtUpArea : {
        type : String
    },
    carpetArea : {
        type : String,
        required : true
    }
},
officeSetup : {
    minSeats :  {
        type : Number,
        required : function(){return this.propertyType=='Commercial Office Space'}
    },
    maxSeats :  {
        type : Number,
        required : function(){return this.propertyType=='Commercial Office Space'}
    },
    noOfCabins :  {
        type : Number,
        required : function(){return this.propertyType=='Commercial Office Space'}
    },
    noOfMeetingRooms :  {
        type : Number,
        required : function(){return this.propertyType=='Commercial Office Space'}
    }
},
conferenceRoom : {
    type : Boolean,
    required : function(){return this.propertyType=='Commercial Office Space'}
},
receptionArea : {
    type : Boolean,
    required : function(){return this.propertyType=='Commercial Office Space'}
},
    washrooms : {
        isAvaliable :{
            type : Boolean,
            default : false,
            required : true
        },
        quantity : {
            type : Number,
            required : function(){return this.washrooms.isAvaliable}
        }
    },
    balconies : {
        type : String,
        required : function(){return this.propertyType=='Commercial Shop'||this.propertyType=='Commercial Showroom'}
    },
    pantryType : {
        pantryTypes:{
            type : String,
            enum : ['Private','Shared','Not Avaliable'],
            required : function(){return this.propertyType=='Commercial Office Space'}
        },
        pantrySize :{
            type : String,
        }
    },
    facilities : {
        type : [String],
        enum : ['Furnished','Central Air Condition','Oxygen Duct','UPS']
    },
    fireSafetyMeasures : {
        type : [String],
        enum : ['Fire Extingusher','Fire Sensors','Sprinklers','Firehouse']
    },
    floorDetails : {
        totalFloors : {
            type : Number,
            required : true
        },
        yourFloor : {
            type : Number,
            required : true
        },
        noOfStaircases : {
            type : Number,
            required : true
        }
    },
    lifts :{
        isAvaliable : {
            type : Boolean,
            required : true
        },
        passengerLifts : {
            type : Number,
            required : true
        },
        serviceLifts : {
            type : Number,
            required : true
        }
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
            required : function(){return this.possessionStatus=='Under Construction'}
        },
        year :{
            type : Number,
            required : function(){return this.possessionStatus=='Under Construction'}
        }
    },
    ageOfConstruction : {
        type : String,
        enum : ['New Construction','Less than 5 years','5 to 10 years','10 to 15 years','15 to 20 years','Above 20 years'],
        required : function(){return this.possessionStatus=='Ready to Move'}
    },
    ownershipStatus : {
        type : String,
        enum : ['Freehold','Leasehold','Power Of Attorney','Co-operative Society'],
        required : true
    },
    expectedPrice :{
        type : String,
        required : function(){ return this.propertyFor=='Sale'}
    },
    expectedRent :{
        type : String,
        required : function(){ return this.propertyFor=='Rent'}
    },
    securityDeposit :{
        type : String,
        required : function(){ return this.propertyFor=='Rent'}
    },
    priceIncludes :{
        type :[String],
        enum : ['Tax and Govt Charges','DG and UPS Price Included','Price Negotiable']
    },
    brokerage : {
        brokerageType :{
            type : String,
            enum : ['Fixed','Percentage']
        },
        percentageBrokerage : {
        type : String,
        enum : ['No Brokerage','0.25%','0.5%','0.75%','1%','1.5%','2%','3%','4%'],
        required :  function(){return this.brokerage.brokerageType=='Percentage'}
        },
        fixedBrokerage : {
            type : String,
            required :  function(){return this.brokerage.brokerageType=='Fixed'}
        }
    },
    NOCCertified : {
        type : Boolean,
        default : false,
        required : true
    },
    OccupanceCertified : {
        type : Boolean,
        default : false,
        required : true
    },
    description : {
        type : String,
        required : true
    }
},{
    timestamps: true,
});

const Commercial = mongoose.model('Commercial',CommercialSchema);
module.exports = Commercial;

//Add map soon