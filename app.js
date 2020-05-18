const express = require('express');
const app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');
const PORT = process.env.PORT || 4001;

// Import DB
var sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('dev'));

// GET Request
app.get('/strips', (req, res, next) => {
  db.all('SELECT * FROM Strip', (err, rows) => {
    if (err) {
      res.sendStatus(505);
    } else {
      res.send({ strips: rows });
    }
  });
});

// Middleware for Validate Strip before POST
const validateStrip = (req, res, next) => {
  let stripToCreate = req.body.strip;
  if (
    !stripToCreate.head ||
    !stripToCreate.body ||
    !stripToCreate.background ||
    !stripToCreate.bubbleType
  ) {
    return res.sendStatus(400); // bad request
  }
  next();
};

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
module.exports = app;
