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

// Middleware for Validating Strip before POST
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

// POST request
app.post('/strips', validateStrip, (req, res, next) => {
  let stripToCreate = req.body.strip;
  db.run(
    `INSERT INTO Strip (head, body, background, bubble_type, bubble_text, caption) VALUES ($head, $body, $background, $bubbleType, $bubbleText, $caption)`,
    {
      $head: stripToCreate.head,
      $body: stripToCreate.body,
      $background: stripToCreate.background,
      $bubbleType: stripToCreate.bubbleType,
      $bubbleText: stripToCreate.bubbleText,
      $caption: stripToCreate.caption,
    },
    function (err) {
      if (err) {
        return res.sendStatus(500); // internal server error
      }
      db.get(`SELECT * FROM Strip WHERE id = ${this.lastID}`, (err, row) => {
        if (!row) {
          return res.sendStatus(500); //internal server error
        }
        res.status(201).send({ strip: row });
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
module.exports = app;
