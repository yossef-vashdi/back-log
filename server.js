const express = require('express');
const cors = require('cors');

const logController = require('./logController/router');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/logs', logController);

app.listen(5000, () => {
  console.log('listening on port 5000 ...');
});
