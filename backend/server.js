const { app, connectDB } = require('./src/app');
const { port } = require('./src/config');

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`API listening on port ${port}`));
  })
  .catch((err) => {
    console.error('Startup failed:', err);
    process.exit(1);
  });
