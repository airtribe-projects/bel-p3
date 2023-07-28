const express = require('express');
const app = express();

function logger(req, res, next) {
  console.log('Request received:', req.method, req.url);
  next();
}

app.use(logger);

// Simple endpoint
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});