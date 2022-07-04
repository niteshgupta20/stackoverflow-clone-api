const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 5000;

// bring all routes
const auth = require('./routes/api/auth');
const questions = require('./routes/api/questions');
const profile = require('./routes/api/profile');
const passport = require('passport');

// mongoDB configuration
const db = require('./setup/myurl').MONGOURL;

// connect to DB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.log(err));

// Middleware for bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Passport middleware
app.use(passport.initialize());

// config for JWT Strategy
require('./strategies/jsonwtStrategy')(passport);


// route 
app.get('/', (req, res) => {
  res.send('Welcome to Stackoverflow clone api');
});

// bring all routes
app.use('/api/auth', auth);
app.use('/api/questions', questions);
app.use('/api/profile', profile);

app.listen(PORT, () => { console.log(`Server is up and Running at ${PORT} port`); });