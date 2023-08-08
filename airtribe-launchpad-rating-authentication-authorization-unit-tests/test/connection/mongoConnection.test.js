const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

before((done) => {
  mongoose.connect('mongodb://localhost:27017/usersTestDB', {
  useUnifiedTopology: true,
  useNewUrlParser: true
  }).then(() => {
    console.log('Connected to MongoDB');
    done();
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    done(error);
  });
});


beforeEach((done) => {
  console.log('running before each clause');
  mongoose.connection.collections.users.drop(() => {
        //this function runs after the drop is completed
      done(); //go ahead everything is done now.
  });
});

afterEach((done) => {
  console.log('running after each clause');
  mongoose.connection.collections.users.drop(() => {
        //this function runs after the drop is completed
      done(); //go ahead everything is done now.
  });
});

after(() => {
  console.log("Disconnecting the database");
  mongoose.disconnect();
});