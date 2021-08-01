const chai = require("chai");
const expect = chai.expect;
const bcrypt = require('bcrypt');
const chaiHttp = require("chai-http");
const baseUrl = "localhost:3000"
const db = require('../Config/database');
const User = require("../Models/User");
const Commercial = require("../Models/Commercial")
const app = require("./../Config/app");
const request  = require("supertest");
const agent = request.agent(baseUrl);
const path = require('path');
const Residental = require("../Models/Residental");
chai.use(chaiHttp);
describe('Admin Routes Tests',()=>{
    before((done)=>{
    bcrypt.hash("testingpassword",parseInt(process.env.Salt)).then(password=>{
        db.connect();
        let user ={
            email : "test@test.com",
            phone:9699179186,
            name:"tester",
            password : password,
            isAdmin : true 
        }
        User.deleteMany({}).then(deleted=>{
            User.create(user).then(user=>{
                done();
            }); 
        })
    });
   });
    after((done)=>{
        User.deleteMany({}).then(()=>{
            Commercial.deleteMany({}).then(()=>{
                Residental.deleteMany({}).then(()=>{
                    db.close();
                    done();  
                });
            });
        });  
    });
    it('Admin Dashboard When Accessed Logged Out',(done)=>{
        agent
        .get('/admin/admindashboard')
        .end((err,res)=>{
            expect(res.text).to.be.equal('Found. Redirecting to /');
            expect(err).to.be.equal(null);
            done();
        })
    })
    it('Admin Login With Proper Credentials',(done)=>{
        agent
        .post('/user/login')
        .send({
            email : "test@test.com",
            password : "testingpassword"
        })
       .end((err,res)=>{
        expect(res.header.location).to.be.equal("/user/loginredirect");
        expect(err).to.be.equal(null);
        done();
        })
    })
    it('Admin Dashboard When Accessed Logged In',(done)=>{
        agent
        .get('/admin/admindashboard')
        .end((err,res)=>{
            expect(res.text).not.be.equal('Found. Redirecting to /');
            expect(err).to.be.equal(null);
            done();
        })
    })
    it('Create Residential Property',(done)=>{
        agent
        .post('/property/createresidentialproperty')
        .field("propertyType","Flat/Apartment")
        .field("propertyFor","Sale")
        .field("locality","Roadpali")
        .field("name","Barath")
        .field("address","1402 Siddhivinayak Heights Plot No - 47 Sector - 29, Pin- 410218 , Navi Mumbai")
        .field("Bedrooms","1")
        .field("lenght0","500")
        .field("breadth0","300")
        .field("Balconies","1")
        .field("bathroom","1")
        .field("floorNo","13")
        .field("totalFloors","15")
        .field("flatsOnFloor","3")
        .field("furnishingStatus","Furnished")
        .field("furniture",["TV","TV unit","Modular Kitchen","Microwave","Fridge","Washing machine"])
        .field("Quantity",["","","","",""])
        .field("carpetArea",["150000","Sqft"])
        .field("superBuiltUpArea",["120000","Sqft"])
        .field("builtUpArea",["13333","Sqft"])
        .field("expectedPrice","5000000")
        .field("bookingAmount","5000")
        .field("transactionType","New Property")
        .field("possessionStatus","Ready to Move")
        .field("ageOfConstruction","Less than 5 years")
        .field("saleBrokerage","2%")
        .field("expectedRent","No Brokerage")
        .field("securityDeposit","Fixed")
        .field("rentBrokerage","1000")
        .field("priceType","Fixed")
        .field("maintaninceCharge","1000")
        .field("maintaninceChargeType","Monthly")
        .field("priceIncludes",["Car Parking","Club Membership"])
        .field("stampDutyCharges","true")
        .field("additonalRooms",["Puja Room","Store Room","Servant Room"])
        .field("facing","East")
        .field("overlooking",["Main Road","Not Availiable"])
        .field("carParking","Covered")
        .field("liftsInTheTower","2")
        .field("multipleUnitsAvaliable","true")
        .field("unitQuantity","10")
        .field("avaliablityOfWater","24 Hours Available")
        .field("avaliablityOfElectricity","24 Hours Available")
        .field("ownershipStatus","Freehold")
        .field("flooring",["Ceramic Tiles","Marble","Normal Tiles/Kotha Stone","Vitrified"])
        .field("amenities",["Air Conditioned","Banquet Hall","Vaastu Compliant"])
        .field("description","2 BHK apartment in Roadpali.")
        .field("landmarks","Near Home")
        .attach("CoverImages",path.resolve(__dirname,'./Images/cover.png'))
        .attach("Other",path.resolve(__dirname,'./Images/residential.jpg'))
        .end((err,res)=>{
        expect(res.header.location).to.be.equal("/admin/admindashboard");
        expect(err).to.be.equal(null);
        done();
        })
    })
    it('Create Commercial Property',(done)=>{
        agent
        .post('/property/createcommercialproperty')
        .field("propertyType","Commercial Shop")
        .field("propertyFor","Sale")
        .field("locality","Roadpali")
        .field("name","Barath`s Shop")
        .field("address","1402 Siddhivinayak Heights Plot No - 47 Sector - 29, Pin- 410218 , Navi Mumbai")
        .field("locatedInside","IT Park")
        .field("zoneType","Industrial")
        .field("minSeats","")
        .field("maxSeats","")
        .field("noOfCabins","")
        .field("noOfMeetingRooms","")
        .field("pantryTypes","")
        .field("pantrySize","")
        .field("balconies",["","3"])
        .field("WashroomisAvaliable","true")
        .field("quantity","12")
        .field("facilities","Furnished")
        .field("fireSafetyMeasures",["Fire Extingusher", "Fire Sensors"])
        .field("totalFloors","15")
        .field("yourFloor","14")
        .field("noOfStaircases","4")
        .field("liftisAvaliable","true")
        .field("passengerLifts","4")
        .field("serviceLifts","2")
        .field("carpetArea",["150000","Sqft"])
        .field("superBuiltUpArea",["120000","Sqft"])
        .field("builtUpArea",["13333","Sqft"])
        .field("expectedPrice","5000000")
        .field("bookingAmount","5000")
        .field("transactionType","New Property")
        .field("possessionStatus","Under Construction")
        .field("month","May")
        .field("year","2025")
        .field("ageOfConstruction","")
        .field("saleBrokerage","0.25%")
        .field("expectedRent","")
        .field("securityDeposit","")
        .field("rentBrokerage","No Brokerage")
        .field("priceIncludes",["Tax and Govt Charges","DG and UPS Price Included"])
        .field("NOCCertified","true")
        .field("OccupanceCertified","true")
        .field("description","Best Shop in the world")
        .attach("CoverImages",path.resolve(__dirname,'./Images/cover.png'))
        .attach("Other",path.resolve(__dirname,'./Images/residential.jpg'))
        .end((err,res)=>{
        expect(res.header.location).to.be.equal("/admin/admindashboard");
        expect(err).to.be.equal(null);
        done();
        })
    })
    it('Admin Logout',(done)=>{
        agent
        .get('/user/logout')
        .end((err,res)=>{
            expect(res.header.location).to.be.equal('/login');
            expect(err).to.be.equal(null);
            done();
        })
    })
})