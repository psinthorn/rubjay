const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

//load router
const users = require('./routers/users');
const ideas = require('./routers/ideas');

//load passport 
require('./config/passport')(passport);

//load mongoDB config
const db = require('./config/database');

const app = express();

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//Connect to mongoDB by Mongoose
mongoose.connect(db.mongoURL, {
    useMongoClient: true
})
.then(() => console.log('Connected to mongoDB...'))
.catch(err => console.log(err));


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

//static public folder
app.use(express.static(path.join(__dirname, 'public')));

//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//connect-flash middleware
app.use(flash());

//global variable
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Start route here
//Index route page
app.get('/', (req, res) => {
    res.render('index');
});

//About route page

app.get('/about', (req, res) => {
    res.render('about');
});



//use Router
app.use('/users', users);
app.use('/ideas', ideas);


//NodeJS server Config
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Node started on port' + port);
});


