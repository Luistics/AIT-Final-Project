const mongoose = require('mongoose');
const User = mongoose.model('User');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(User.authenticate()));
passport.serialize(User.serializeUser());
passport.deserializeUser(User.deserializeUser());