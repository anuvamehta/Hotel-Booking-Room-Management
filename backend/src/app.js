const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { mongoUri } = require('./config');
const { router, ensureSeeded } = require('./routes/rooms');

const allowedOrigins = [
  'https://hotel-booking-room-management.vercel.app',
  'http://localhost:4200',
];

const app = express();
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Cache the connection across serverless invocations so we don't reconnect
// (and re-seed) on every request. Reset on failure so a later request can retry.
let connectionPromise = null;
function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(ensureSeeded)
      .catch((err) => {
        connectionPromise = null;
        throw err;
      });
  }
  return connectionPromise;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api', router);

module.exports = { app, connectDB };
