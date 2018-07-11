const mongoose = require('mongoose');
const User = require('../app/models/user');
const Profile = require('../app/models/profile');

module.exports = function(app, passport){

    app.use((req, res, next) => {

        res.locals.user = req.user;
        res.locals.error = req.flash('error');
        next();
    });

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/login', function (req, res){

        let errorMessage = req.flash('error');
        res.render('login');
    });

    app.post('/login', passport.authenticate('local-login',{

        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/register', (req, res) => {

        let errorMessage = req.flash('error');
        res.render('register');
    });

    app.post('/register', passport.authenticate('local-register',{

        successRedirect: '/create-profile',
        failureRedirect: '/register',
        failureFlash: true
    }));


    app.get('/logout', function(req, res){

        req.logOut();
        res.redirect('/');
    });

    app.get('/create-profile', isLoggedIn, (req,res) => {

        res.render('create-profile');

    });

    app.get('/profile/:slug/edit', isLoggedIn, (req,res) => {

        if(req.user.local.username.toUpperCase() === req.params.slug.toUpperCase()){
            res.render('profile-edit');
        }
        else{
            res.redirect('/');
        }

    });

    app.post('/profile/:slug/edit', isLoggedIn, (req,res) => {

        User.findOne({'slug': req.params.slug}).exec(function(err, foundUser){

            if (err) {
                res.redirect('/');
            }

            if(!foundUser){
                res.redirect('/');
            }
            else{
                Profile.findOneAndUpdate({'user': foundUser._id},{
                    $set:{
                        "games" : req.body.games,
                        "age": req.body.age,
                        "gender": req.body.gender,
                        "description": req.body.about,
                        "location": req.body.location,
                    }
                }, function(err, profile){
                    if(err)
                        res.redirect('/');
                    else
                        res.redirect('/profile/:slug');
                });
            }


        });


    });

    app.get('/play', isLoggedIn, (req,res) => {

        res.render('gangup');
    });

    //find users who the current user has not yet matched with, and send them to the client
    app.get('/play/start', isLoggedIn, (req,res) => {

        User.find({
                likes: {$nin: [req.user.local.username],
            }}, function(err, users){

            if(err) {
                res.redirect('/');
            }
            else{
                res.json(users);
            }

        });

    });

    app.get('/play/swipe', isLoggedIn, (req,res) => {

        Profile.findOne({"user": req.query.user_id}, function(err, profile){

            if(err) {
                res.redirect('/');
            }
            else{
                res.json(profile);
            }

        });

    });

    app.post('/play/swipe/matched', isLoggedIn, (req,res) => {

        const matched = req.body.matched;
        const currUser = req.user;

        User.findOne({"_id": matched}, function(err, foundUser) {

            if(err){
                console.log("usererror");
            }
            else{

                const matchedUsername = foundUser.local.username;

                Profile.findOneAndUpdate(

                    {"user": currUser},
                    {$addToSet: {"likes": matchedUsername}},

                    function(err, liked){
                    if(err)
                        res.redirect('/');
                    else
                        res.json(liked);
                });
            }

        });

    });


    app.post('/create-profile', isLoggedIn, (req,res) => {

        let profile2 = new Profile({

            user : req.user._id,
            username : req.user.local.username,
            epicID: req.body.epicGT,
            psnID: req.body.ps4,
            xboxLiveID: req.body.xbox1,
            location: req.body.location,
            age: req.body.age,
            games : req.body.games,

        }).save(function(err, profile){

            req.user.local.profile = profile2;
            res.render('create-profile', {success: "success"})
        })

    });

    app.get('/profile/:slug', isLoggedIn, (req,res) => {

        let isOwn = false;
        if(req.user.local.username.toUpperCase() === req.params.slug.toUpperCase()){
            isOwn = true;
        }

        User.findOne({'slug': req.params.slug}).exec(function (err, foundUser) {

            if (err) {
                res.redirect('/');
            }


            if(!foundUser){
                res.redirect('/');
            }
            else {
                Profile.findOne({'user': foundUser._id}, function (err, profile) {

                    if (err) {
                        res.redirect('/');
                    }
                    else {
                        res.render('profile', {

                            'username': profile.username,
                            'epicID': profile.epicID,
                            'PSN': profile.psnID,
                            'xboxLive': profile.xboxLiveID,
                            'location': profile.location,
                            'games': profile.games,
                            'age': profile.age,
                            'gender': profile.gender,
                            'description': profile.description,
                            'likes' : profile.likes,
                            'isOwn': isOwn
                        });
                    }
                });
            }
        });
    });

    function isLoggedIn(req, res, next){

        if(req.isAuthenticated()){
            return next();
        }

        res.redirect('/');
    }

};
