var User = require("../../src/models/user");
var bcrypt = require("bcrypt");
const expect = require('chai').expect;
const sinon = require('sinon');

describe('Creating documents in MongoDB', () => {
  it('Creates a New User Successfully', (done) => {
    const user = new User({
      fullName: 'Test User',
      email: 'test1234@gmail.com',
      role: 'admin',
      password: bcrypt.hashSync('test1234', 8)
    });
    expect(user.isNew).equal(true);
    user.save().then(user => {
      expect(!user.isNew).equal(true);
      done();
    }).catch(err => {
      done();
    });
  }).timeout(20000);

  it('validates the email of the user', (done) => {
    const user = new User({
      fullName: 'Test User',
      email: 'test@1234@gmail.com',
      role: 'admin',
      password: bcrypt.hashSync('test1234', 8)
    });
    user.save().catch((err) => {
      expect(err._message).equal('User validation failed');
      done();
    });
  }).timeout(10000);

  it('validates the role of the user', (done) => {
    const user = new User({
      fullName: 'Test User',
      email: 'test@1234@gmail.com',
      role: 'test',
      password: bcrypt.hashSync('test1234', 8)
    });
    user.save().catch((err) => {
      expect(err._message).equal('User validation failed');
      done();
    });
  }).timeout(5000);

  it('validates the fields of the user', (done) => {
    const user = new User({
      email: 'test@1234@gmail.com',
      role: 'test',
      password: bcrypt.hashSync('test1234', 8)
    });
    user.save().catch((err) => {
      expect(err._message).equal('User validation failed');
      done();
    });
  }).timeout(5000);
});

describe('Stubbed tests for creating the documents in mongo db', () => {
  let saveStub;
  const user = new User({
    fullName: 'Test User',
    email: 'test1234@gmail.com',
    role: 'admin',
    password: bcrypt.hashSync('test1234', 8)
  });

  beforeEach(() => {
    saveStub = sinon.stub(User.prototype, 'save');
  });

  afterEach(() => {
    saveStub.restore();
  });

  it('Should save the user', async () => {
    const mockUser = { _id: '123', fullName: 'Test User', email: 'test1234@gmail.com', role: 'admin' };
    saveStub.resolves(mockUser);
    
    const result = await user.save();
    expect(result).to.deep.equal(mockUser);
    expect(saveStub.calledOnce).to.be.true;
  });

  it('should handle error', async () => {
    const mockError = new Error('Database error');
    saveStub.rejects(mockError);

    try {
      await user.save();
    } catch (error) {
      expect(error).to.equal(mockError);
      expect(saveStub.calledOnce).to.be.true;
    }
  });
});