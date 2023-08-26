const fs = require('fs');
const path = require('path');

// Create a readable stream from a file
const readableStream = fs.createReadStream(path.join(__dirname, 'input.txt'), 'utf8');

// Create a writable stream to a file
const writableStream = fs.createWriteStream(path.join(__dirname, 'output.txt'), 'utf8');


let i=0;
// Handle events on the streams
readableStream.on('data', (chunk) => {
  console.log(`Received chunk of data: ${i}`, chunk.length);
  setTimeout(() => {
    writableStream.write(chunk);
  }, 2000);
  i++;
});

writableStream.on('finish', () => {
  console.log('Write operation finished.');
});

writableStream.on('error', (error) => {
  console.error('Error writing to the stream:', error);
});