const express = require('express');
const app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
module.exports = app;
