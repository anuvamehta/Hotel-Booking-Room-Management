const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { port, mongoUri } = require('./src/config');
const { router, ensureSeeded } = require('./src/routes/rooms');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(ensureSeeded)
  .then(() => {
    app.listen(port, () => console.log(`API listening on port ${port}`));
  })
  .catch((err) => {
    console.error('Startup failed:', err);
    process.exit(1);
  });
