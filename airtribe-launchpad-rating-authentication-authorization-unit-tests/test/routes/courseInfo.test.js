let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../src/app');
const expect = require('chai').expect;

describe('Fetches all the courses' , () => {
  let jwtToken = '';
  beforeEach((done) => {
    let singupBody = {
      fullName: 'test name',
      email: 'test12345@gmail.com',
      role: 'admin',
      password: 'test1234'
    };
    chai.request(server).post('/register').send(singupBody).end((err, res) => {
      let signInBody = {
        'email': 'test12345@gmail.com',
        'password': 'test1234'
      }
      chai.request(server).post('/signin').send(signInBody).end((err, siginResponse) => {
        jwtToken = siginResponse.body.accessToken;
        done();
      });
    });
  });

  it('signs in validates the token and fetches the course data', (done) => {
   chai.request(server).get('/courses').set('authorization', `JWT ${jwtToken}`).end((err, res) => {
      expect(res.status).equal(200);
      expect(res.body.airtribe.length).equal(7);
      done();
    });
  });

  it('signs in, validates the token and and does not pass the authoriation header', (done) => {
    chai.request(server).get('/courses').end((err, res) => {
      expect(res.status).equal(403);
      expect(res.body.message).equal('Authorization header not found');
      done();
    }).timeout(5000);
  });

  it('signs in, validates the token and and does not pass the valid access header', (done) => {  
    chai.request(server).get('/courses').set('authorization', `JWT ${jwtToken}abcd`).end((err, res) => {
      expect(res.status).equal(403);
      expect(res.body.message).equal('Invalid JWT token');
      done();
    }).timeout(5000);
  });  
});