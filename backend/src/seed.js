const mongoose = require('mongoose');
const { mongoUri } = require('./config');
const Room = require('./models/Room');
const { buildRooms } = require('./roomLayout');

// Drops existing rooms and inserts a fresh, unbooked hotel layout.
async function seed() {
  await Room.deleteMany({});
  await Room.insertMany(buildRooms());
}

if (require.main === module) {
  mongoose
    .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(seed)
    .then(() => {
      console.log('Seeded hotel rooms.');
      return mongoose.disconnect();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seed };
