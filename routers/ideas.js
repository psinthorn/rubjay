const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');


//Load mongoose ideas model schema
require('../models/Ideas'); 
const Idea = mongoose.model('ideas');


//Ideas view page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({user: req.user.id})
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('./ideas/ideas', {ideas: ideas})
    });   
});


//Ideas add page
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('./ideas/add');
});

//Process post from
router.post('/', ensureAuthenticated, (req, res) => {
    const errors = [];
    const success = 'Input Success';
    if(!req.body.title){
        errors.push({text: 'Please input title'});
    }

    if(!req.body.details){
        errors.push({text: 'Please input details'});
    }
    if(errors.length > 0 ){
        res.render('ideas/add', {
        errors: errors,
        title: req.body.title,
        details: req.body.details
    });

    }else{

        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }

        console.log(newUser);

        new Idea(newUser).save()
        .then(idea => {
            req.flash('success_msg', 'New idea added');
            res.redirect('/ideas');
        })      
    }
});

//Ideas edit page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    Idea.findOne({
        _id: id
    })
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not authorize please login');
        }else{
            res.render('ideas/edit', {
            idea: idea
        });
    }
    });  
});


router.put('/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    Idea.findOne({
        _id: id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Idea updated');
            res.redirect('/ideas');
        });
    });
});


//Delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash('error_msg', 'Idea has been deleted');
        res.redirect('/ideas');
    });
    //res.send('delete');
});

module.exports = router;