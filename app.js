const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookies = require('cookie-parser');
const { authStatus } = require('./middleware/middleware');
const app = express();


// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookies());

// view engine
app.set('view engine', 'ejs');



// database connection
const dbURI = 'mongodb+srv://keezy2013:QmZq6WeD7tVBMoNb@cluster0.0g0qiwz.mongodb.net/node-auth';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3005))
  .catch((err) => console.log(err));




  // routes
app.get('/', (req, res) => res.render('home'));
app.get('/blogs', authStatus, (req, res) => res.render('blogPosts'));
app.get('/blogs2', authStatus, (req, res) => res.render('blogPosts2'));
app.get('/logout', authStatus, (req, res) => res.render('logout'));
app.get('/filter', authStatus, (req, res) => res.render('filter'));
app.get('/news', authStatus, (req, res) => res.render('news'));
app.get('/allblogs', authStatus,(req, res) => res.render('allBlogs'))
app.use(authRoutes);