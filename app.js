const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');
const app = express();

//connect to database
require('./config/db.js');

//connect passport configuration
require('./config/passport')(passport);

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


app.use(session({
    secret: 'suchsecretwowe!',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

//enable flash messages for login/register errors
app.use(flash());


//routes
require('./app/routes.js')(app, passport);


//app startup
app.listen(process.env.PORT || 3000);
console.log("This is the port: " + (process.env.PORT || 3000));

