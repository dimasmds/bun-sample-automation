// 123456

/*
    123456
 */

const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('<h1>1234567</h1>');
});

app.listen(5000);
