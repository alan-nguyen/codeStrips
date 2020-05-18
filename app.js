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

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
module.exports = app;
