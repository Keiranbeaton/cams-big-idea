'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const baseUrl = 'localhost:5000/api';
const User = require('../model/user');

describe('Auth testing', function() {
  it('POST new user', function(done) {
    chai.request(baseUrl)
      .post('/signup')
      .send({firstName:'TestName1', lastName:'TestName2', email: 'AuthTest@test.com', password: 'AuthTestPassword', role: 'jobseeker'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        expect(res.body.token.length).to.not.eql(0);
        done();
      });
  });
  describe('Auth testing with User in Database', function() {
    before(function(done) {
      let user = new User({firstName: 'AuthTestFirst', lastName: 'AuthTestLast', basic: {email:'AuthTestEmail@test.com', password: 'AuthTestPassword'}, role: 'jobseeker'});
      user.generateHash(user.basic.password).then((token) => {
        this.tokenData = token;
        user.save().then((userData) => {
          this.user = userData;
          done();
        }, (err) => {throw err;});
      }, (err) => {throw err;});
    });
    it('Authenticating Existing User', function(done) {
      chai.request(baseUrl)
        .get('/signin')
        .auth('AuthTestEmail@test.com', 'AuthTestPassword')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body).to.have.property('token');
          expect(res.body.token.length).to.not.eql(0);
          done();
        });
    });
    it('Authenticating Bad Credentials', function(done) {
      chai.request(baseUrl)
        .get('/signin')
        .auth('bad', 'credentials')
        .end((err, res) => {
          expect(err).to.not.eql(null);
          expect(res.status).to.eql(404);
          expect(res.text).to.eql('"User not found"');
          done();
        });
    });
    it('Authenticating with Token', function(done) {
      chai.request(baseUrl)
        .get('/jwtAuth')
        .set('Authorization', 'Bearer ' + this.tokenData.token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.status).to.eql(200);
          done();
        });
    });
    it('Authenticating without Token', function(done) {
      chai.request(baseUrl)
        .get('/jwtAuth')
        .end((err, res) => {
          expect(err).to.not.eql(null);
          expect(err.message).to.eql('Internal Server Error');
          expect(res.status).to.eql(500);
          done();
        });
    });
  });
});
