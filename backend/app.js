const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const PostRouter = require('./routes/post.route');
const UserRouter = require('./routes/user.route');

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

mongoose.connect('mongodb://localhost/post-cat', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log(`Server succefully connected to the database! `);
  })
  .catch(err => {
    console.log(`The conection as fail`);
    console.log(err);
  });

// app.use(bodyParser);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/images', express.static(path.join('backend/images'))); // Let access the folder globaly

app.use('/api/posts', PostRouter);
app.use('/api/user', UserRouter);

module.exports = app;
