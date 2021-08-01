const chai = require("chai");
const expect = chai.expect;
const bcrypt = require('bcrypt');
const chaiHttp = require("chai-http");
const baseUrl = "localhost:3000"
const db = require('../Config/database');
const User = require("../Models/User");
const app = require("./../Config/app");
const request  = require("supertest");
const agent = request.agent(baseUrl)
chai.use(chaiHttp);
describe('User Routes Tests',()=>{
    before((done)=>{
    bcrypt.hash("testingpassword",parseInt(process.env.Salt)).then(password=>{
        db.connect();
        let user ={
            email : "test@test.com",
            phone:9699179186,
            name:"tester",
            password : password,
            isAdmin : false 
        }
        User.deleteMany().then(deleted=>{
            User.create(user).then(user=>{
                done();
            }); 
        })
    });
   });
    after((done)=>{
        User.deleteMany().then(()=>{
        db.close();
        done();  
        });    
    });
    it('Register',(done)=>{
        agent
        .post('/user/register')
        .send({
            email : "register@test.com",
            phone:9699179187,
            name:"tester",
            isAdmin : false 
        })
        .end((err,res)=>{
            expect(res.header.location).to.be.equal('/login');
            expect(err).to.be.equal(null);
            done();
        })
    })
    it('Register with Invalid Email',(done)=>{
        agent
        .post('/user/register')
        .send({
            email : "register",
            phone:9699179188,
            name:"tester",
            isAdmin : false 
        })
        .end((err,res)=>{
            expect(res.statusCode).to.be.equal(500);
            expect(JSON.parse(res.text).message).to.be.equal("Please enter all required fields");
            done();
        })
    })
    it('Register with Invalid Phone Number',(done)=>{
        agent
        .post('/user/register')
        .send({
            email : "register",
            phone:96991791883,
            name:"tester",
            isAdmin : false 
        })
        .end((err,res)=>{
            expect(res.statusCode).to.be.equal(500);
            expect(JSON.parse(res.text).message).to.be.equal("Please enter all required fields");
            done();
        })
    })
    it('Register without Email',(done)=>{
        agent
        .post('/user/register')
        .send({
            phone:96991791883,
            name:"tester",
            isAdmin : false 
        })
        .end((err,res)=>{
            expect(res.statusCode).to.be.equal(500);
            expect(JSON.parse(res.text).message).to.be.equal("Please enter all required fields");
            done();
        })
    })
    it('Register without Phone',(done)=>{
        agent
        .post('/user/register')
        .send({
            email : "register2@test.com",
            name:"tester",
            isAdmin : false 
        })
        .end((err,res)=>{
            expect(res.statusCode).to.be.equal(500);
            expect(JSON.parse(res.text).message).to.be.equal("Please enter all required fields");
            done();
        })
    })
    it('Register with duplicate key',(done)=>{
        agent
        .post('/user/register')
        .send({
            email : "register@test.com",
            phone:9699179187,
            name:"tester",
            isAdmin : false 
        })
        .end((err,res)=>{
            expect(res.statusCode).to.be.equal(500);
            expect(JSON.parse(res.text).message).to.be.equal("Email or Phone Number already exists");
            done();
        })
    })
    it('User Login With Wrong Credentials',(done)=>{
        agent
        .post('/user/login')
        .send({
            email : "test@test.com",
            password : "testingpassword4"
        })
        .end((err,res)=>{
            expect(res.header.location).to.be.equal('/login');
            expect(err).to.be.equal(null);
            done();
        })
    })
    it('User Dashboard When Not Logged In',(done)=>{
        agent
        .get('/dashboard')
        .end((err,res)=>{
            expect(res.text).to.be.equal('Found. Redirecting to /');
            expect(err).to.be.equal(null);
            done();
        })
    })
    it('User Login With Proper Credentials',(done)=>{
        agent
        .post('/user/login')
        .send({
            email : "test@test.com",
            password : "testingpassword"
        })
       .end((err,res)=>{
        expect(res.header.location).to.be.equal("/user/loginredirect");
        done();
        })
    })
    it('User Dashboard When Logged In',(done)=>{
        agent
        .get('/dashboard')
        .end((err,res)=>{
            expect(res.text).not.be.equal('Found. Redirecting to /');
            expect(err).to.be.equal(null);
            done();
        })
    })
    it('Logout',(done)=>{
        agent
        .get('/user/logout')
        .end((err,res)=>{
            expect(res.header.location).to.be.equal('/login');
            expect(err).to.be.equal(null);
            done();
        })
    })
})