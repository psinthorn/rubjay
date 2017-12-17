const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();


//load users model
require('../models/User');
const User = mongoose.model('users');

//user login form
router.get('/login', (req, res) => {
    res.render('./users/login');
});

// //login post
// router.post('/login', (req, res) => {
//     console.log(req.body);
// });

//login post
router.post('/login', (req,res, next) => {
    passport.authenticate('local',{
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//register form
router.get('/register', (req, res) => {
    res.render('./users/register');
});

//register post
router.post('/register', (req, res) => {

    let errors = [];
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2


    if (password != password2) {
        errors.push({
            text: 'Password not match'
        });
    }

    if (password.length < 4) {
        errors.push({
            text: 'Password must be at lease 4 charecters'
        });
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            password2: password2
        });

    } else {

        User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                req.flash('error_msg', 'Email already register');
                res.redirect('/users/login');
            }else{
                const newUser = new User({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                });
        
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
        
                        newUser.save()
                            .then(users => {
                                req.flash('success_mag', 'Register Success and now you can login');
                                res.redirect('/users/login');
                             
                            })
                            .catch(err => {
                                console.log(err);
                                return;
                            });
                    });
                });
            }
        });

       
    }


});

//User logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logout success');
    res.redirect('/users/login');
});



module.exports = router;