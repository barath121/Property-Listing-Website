const app = require('./Config/app');
const DatabaseSetup =require('./Config/database');
const Routesinit = require('./Routes/Routesinit');
DatabaseSetup();
Routesinit(app);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});