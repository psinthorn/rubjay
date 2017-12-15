const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//Connect to mongoDB by Mongoose
mongoose.connect('mongodb://localhost/ecovid-ideos', {
    useMongoClient: true
})
.then(() => console.log('Connected to mongoDB...'))
.catch(err => console.log(err));

//Load mongoose ideas model schema
require('./models/Ideas'); 
const Idea = mongoose.model('ideas');

//Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

//bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//method-override middleware 
app.use(methodOverride('_method'));

//Start route here
//Index route page
app.get('/', (req, res) => {
    res.render('index');
});

//About route page

app.get('/about', (req, res) => {
    res.render('about');
});

//Ideas view page
app.get('/ideas', (req, res) => {
    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('./ideas/ideas', {ideas: ideas})
    });   
});


//Ideas add page
app.get('/ideas/add', (req, res) => {
    res.render('./ideas/add');
});

//Process post from
app.post('/ideas', (req, res) => {
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
            details: req.body.details
        }

        console.log(newUser);

        new Idea(newUser).save()
        .then(idea => {
            res.redirect('/ideas')
        })      
    }
});

//Ideas edit page
app.get('/ideas/edit/:id', (req, res) => {
    const id = req.params.id;
    Idea.findOne({
        _id: id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea
        });
    });  
});


app.put('/ideas/:id', (req, res) => {
    const id = req.params.id;
    Idea.findOne({
        _id: id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            res.redirect('/ideas');
        });
    });
});


//Delete idea
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        res.redirect('/ideas');
    });
    //res.send('delete');
});




//NodeJS server Config
const port = 5000;

app.listen(port, () => {
    console.log('Node started on port' + port);
});


