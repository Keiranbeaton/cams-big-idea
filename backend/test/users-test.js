'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const User = require('../model/user');
const baseUrl = 'localhost:5000/api/users';
chai.use(chaiHttp);

describe('User CRUD tests', function() {
  let user;
  before(function(done) {
    user = new User({firstName: 'TestFirstName', lastName:'TestLastName', basic: {email: 'testEmail@test.com', password: 'testPassword'}, locationCity: 'Seattle', locationState: 'WA', locationCountry: 'USA', role: 'jobseeker'});
    user.save().then((userData) => {
      this.user = userData;
      done();
    }, (err) => {throw err;});
  });
  it('testing GET all', function(done) {
    chai.request(baseUrl)
      .get('/')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.length).to.not.eql(0);
        expect(res.status).to.eql(200);
        done();
      });
  });
  it('testing GET jobseekers', function(done) {
    chai.request(baseUrl)
      .get('/jobseekers')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.length).to.not.eql(0);
        expect(res.status).to.eql(200);
        done();
      });
  });
  it('testing GET :id', function(done) {
    chai.request(baseUrl)
      .get('/' + user._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('firstName');
        expect(res.body).to.have.property('lastName');
        expect(res.body).to.have.property('locationCity');
        expect(res.body).to.have.property('locationState');
        expect(res.body).to.have.property('locationCountry');
        expect(res.body).to.have.property('role');
        expect(res.body.firstName).to.eql('TestFirstName');
        expect(res.body.lastName).to.eql('TestLastName');
        expect(res.body.locationCity).to.eql('Seattle');
        expect(res.body.locationState).to.eql('WA');
        expect(res.body.locationCountry).to.eql('USA');
        expect(res.body.role).to.eql('jobseeker');
        expect(res.status).to.eql(200);
        done();
      });
  });
  it('testing GET bad id', function(done) {
    chai.request(baseUrl)
      .get('/badid')
      .end((err, res) => {
        expect(err).to.not.eql(null);
        expect(res.status).to.eql(404);
        expect(err.message).to.eql('Not Found');
        done();
      });
  });
  it('testing PUT', function(done) {
    chai.request(baseUrl)
      .put('/' + user._id)
      .send({firstName: 'NewFirstName', lastName: 'NewLastName'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.eql('Update Successful on ' + user._id + '.');
        expect(res.status).to.eql(200);
        done();
      });
  });
  it('testing PUT bad request', function(done) {
    chai.request(baseUrl)
      .put('/' + user._id)
      .end((err, res) => {
        expect(err).to.not.eql(null);
        expect(res.status).to.eql(400);
        expect(res.text).to.eql('"No data sent with request"');
        expect(err.message).to.eql('Bad Request');
        done();
      });
  });
  it('testing PUT bad id', function(done) {
    chai.request(baseUrl)
      .put('/badid')
      .send({firstName: 'BadIdName'})
      .end((err, res) => {
        expect(err).to.not.eql(null);
        expect(res.status).to.eql(404);
        expect(res.text).to.eql('"User Id Not Found"');
        expect(err.message).to.eql('Not Found');
        done();
      });
  });
  it('testing DELETE', function(done) {
    chai.request(baseUrl)
      .delete('/' + user._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
  });
  it('testing DELETE bad id', function(done) {
    chai.request(baseUrl)
      .delete('/badid')
      .end((err, res) => {
        expect(err).to.not.eql(null);
        expect(res.status).to.eql(404);
        expect(res.text).to.eql('"User Id Not Found"');
        expect(err.message).to.eql('Not Found');
        done();
      });
  });
});
