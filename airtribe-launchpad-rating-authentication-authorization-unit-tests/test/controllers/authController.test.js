process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
var bcrypt = require("bcrypt");
const server = require('../../src/app');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('verifies signup flow with actual mongo db calls' , () => {
  let singupBody = {
    fullName: 'test name',
    email: 'test12345@gmail.com',
    role: 'admin',
    password: 'test1234'
  };

  it("successful singup", (done) => {  
    chai.request(server).post('/register').send(singupBody).end((err, res) => {
      expect(res.status).equal(200);
      expect(res.body.message).equal('User Registered successfully');
      done();
    });
  });

  it("verifies singup flow failing because of email validation", (done) => {
    singupBody.email = 'test@12345@gmail.com';
    chai.request(server).post('/register').send(singupBody).end((err, res) => {
      expect(res.status).equal(500);
      expect(res.body.message.message).equal('User validation failed: email: test@12345@gmail.com is not a valid email!');
      expect(res.body.message._message).equal('User validation failed');
      done();
    });
  });

  it("verifies singup flow failing because of role validation", (done) => {
    singupBody.email = 'test12345@gmail.com';
    singupBody.role = 'test';
    chai.request(server).post('/register').send(singupBody).end((err, res) => {
      expect(res.status).equal(500);
      expect(res.body.message.message).equal('User validation failed: role: `test` is not a valid enum value for path `role`.');
      expect(res.body.message._message).equal('User validation failed');
      done();
    });
  });

  it("verifies singup flow failing because of incomplete properties passed", (done) => {
    singupBody.role = 'admin';
    delete(singupBody.fullName);
    chai.request(server).post('/register').send(singupBody).end((err, res) => {
      expect(res.status).equal(500);
      expect(res.body.message.message).equal('User validation failed: fullName: fullname not provided ');
      expect(res.body.message._message).equal('User validation failed');
      done();
    });
  });
});

describe('verifies the sign in flow with actual mongodb calls', () => {

  beforeEach((done) => {
    let singupBody = {
      fullName: 'test name',
      email: 'test12345@gmail.com',
      role: 'admin',
      password: 'test1234'
    };
    chai.request(server).post('/register').send(singupBody).end((err, res) => {
      done();
    });
  });

  it("successful signin", (done) => {
    let signInBody = {
      'email': 'test12345@gmail.com',
      'password': 'test1234'
    }
    chai.request(server).post('/signin').send(signInBody).end((err, res) => {
      expect(res.status).equal(200);
      expect(res.body.user.email).equal('test12345@gmail.com');
      expect(res.body.user.fullName).equal('test name');
      expect(res.body.message).equal('Login successfull');
      expect(res.body).to.have.property('accessToken');
      done();
    });
  });

  it("Invalid password while signing in", (done) => {
    let signInBody = {
      'email': 'test12345@gmail.com',
      'password': 'test12345'
    }
    chai.request(server).post('/signin').send(signInBody).end((err, res) => {
      expect(res.status).equal(401);
      expect(res.body.message).equal('Invalid Password!');
      expect(res.body.accessToken).to.be.null;
      done();
    });
  });

  it("User does not exist while signing in", (done) => {
    let signInBody = {
      'email': 'someOtherTest@gmail.com',
      'password': 'test12345'
    }
    chai.request(server).post('/signin').send(signInBody).end((err, res) => {
      expect(res.status).equal(404);
      expect(res.body.message).equal('User Not found.');
      expect(res.body.accessToken).to.be.undefined;
      done();
    });
  });
});

describe('verifies the signup flow with stubbed mongo db calls', () => {
  let saveStub;
  let singupBody = {
    fullName: 'test name',
    email: 'test12345@gmail.com',
    role: 'admin',
    password: 'test1234'
  };

  beforeEach((done) => {
    saveStub = sinon.stub(User.prototype, 'save');
    done();
  });

  afterEach(() => {
    saveStub.restore();
  });

  it("successful singup with mocked call", (done) => {  
    const mockUser = { _id: '123', fullName: 'test name', email: 'test12345@gmail.com', role: 'admin' };
    saveStub.resolves(mockUser);
    chai.request(server).post('/register').send(singupBody).end((err, res) => {
      expect(res.status).equal(200);
      expect(res.body.message).equal('User Registered successfully');
      done();
    });
  });
});

describe('verifies the sign in flow with stubbed mongo db calls', () => {
  let findOneStub;
  let signInBody = {
    'email': 'test12345@gmail.com',
    'password': 'test1234'
  }

  beforeEach((done) => {
    findOneStub = sinon.stub(User, 'findOne');
    done();
  });

  afterEach(() => {
    findOneStub.restore();
  });

  it('Verifies the sign in flow using the stubbed mongo db calls', (done) => {
    const mockUser = { _id: '123', fullName: 'test name', email: 'test12345@gmail.com', role: 'admin', password: bcrypt.hashSync('test1234', 8) };
    findOneStub.resolves(mockUser);
    chai.request(server).post('/signin').send(signInBody).end((err, res) => {
      expect(res.status).equal(200);
      expect(res.body.user.email).equal('test12345@gmail.com');
      expect(res.body.user.fullName).equal('test name');
      expect(res.body.message).equal('Login successfull');
      expect(res.body).to.have.property('accessToken');
      done();
    });
  });
});
