// 1234567

/*
    1234567
 */

const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send({ studentId: 1234567 });
});

app.listen(5000);
