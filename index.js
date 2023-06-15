require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./routes');
const app = express();
const sequelize = require('./utils/dbConnection');

const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(session({
    name: 'session',
    secret: 'my_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600 * 1000, // 1hr
    }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

const start = async () => {
    try {
      await sequelize.authenticate();
    // await sequelize.sync();
      app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
      console.log(e);
    }
  };

  start();
// app.listen(PORT, () => console.log('Server is runngin on port 3000'));