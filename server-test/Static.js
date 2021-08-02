const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const baseUrl = "localhost:3000"
const db = require('../Config/database');
const request  = require("supertest");
const agent = request.agent(baseUrl);
const app = require('./../server')
chai.use(chaiHttp);
describe('Static Pages Tests',()=>{
    before((done)=>{
            done();
    });
    after((done)=>{
            done();
    });
    it('Home Page Working',(done)=>{
        agent
        .get('/')
        .end((err,res)=>{
            expect(res).to.have.status(200);
            done();
        })
    })
    it('About Page Working',(done)=>{
        chai.request(baseUrl)
        .get('/about')
        .end((err,res)=>{
            expect(res).to.have.status(200);
            done();
        })
    })
    it('Contact Page Working',(done)=>{
        chai.request(baseUrl)
        .get('/contact')
        .end((err,res)=>{
            expect(res).to.have.status(200);
            done();
        })
    })
    it('Search Page Working',(done)=>{
        chai.request(baseUrl)
        .get('/search')
        .end((err,res)=>{
            expect(res).to.have.status(200);
            done();
        })
    })
    it('Login Page Working',(done)=>{
        chai.request(baseUrl)
        .get('/login')
        .end((err,res)=>{
            expect(res).to.have.status(200);
            done();
        })
    })
    it('Register Page Working',(done)=>{
        chai.request(baseUrl)
        .get('/register')
        .end((err,res)=>{
            expect(res).to.have.status(200);
            done();
        })
    })
})