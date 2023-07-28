const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json()); // parse JSON bodies

// Simple endpoint
app.post('/user', (req, res) => {
  const { name, email } = req.body;
  // Assuming the request body contains { "name": "John", "email": "john@example.com" }
  // You can access the parsed values using req.body
  console.log('Received user:', name, email);
  res.send('User created successfully');
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});