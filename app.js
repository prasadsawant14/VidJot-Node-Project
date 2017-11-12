const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');


const app = express();//initializes our application

//local routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//passport config
require('./config/passport')(passport) ;

//DB config
const db = require('./config/database');

//MAP GLOBAL PROMISE TO GET RID OF DEPRECATION WARNING
mongoose.Promise = global.Promise ;
//CONNECT TO MONGOOSE
mongoose.connect(db.mongoURI,{
    useMongoClient : true
})
.then(()=> {
    console.log("MongoDB Connected");
})
.catch((err)=>{
    console.log(err); 
});



// //HOW MIDDLEWARE WORKS
// app.use(function(req,res,next){
// // console.log(Date.now());
// req.name = "Prasad Sawant";
// next();
// });

//HADNLEBARS MIDDLEWARE
app.engine('handlebars', exphbs({defaultLayout : 'main'}));
app.set('view engine','handlebars');
//BODY-PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({
    extended : false
}));
app.use(bodyParser.json());
//STATICFOLDER
app.use(express.static(path.join(__dirname,'public'))) ;
//METHOD-OVERRIDE MIDDLEARE 
app.use(methodOverride('_method'));
//EXPRESS SESSION MIDDLEWARE
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

  //PASSPORT SESSION MIDDLEWARE RIGHT AFTER EXPRESS SESSION
  app.use(passport.initialize());
  app.use(passport.session());
  //FLASH MIDDLEWARE
  app.use(flash());

//GLOBAL VARIABLES FOR MESSAGES
app.use(function(req,res,next){
 res.locals.success_msg = req.flash('success_msg');
 res.locals.error_msg = req.flash('error_msg');
 res.locals.error = req.flash('error');
 res.locals.user = req.user || null ;
 next();
});


// Index Route
app.get('/',(req,res)=>{
    var title_Var = "Welcome";
    res.render('index',{
        title : title_Var
    });
});

//About route
app.get('/about',(req,res)=>{
    res.render('about');
});






//use routes
app.use('/ideas',ideas);
app.use('/users',users);


const port = process.env.PORT || 8000;


app.listen(port, ()=> {
    console.log(`Server started on port ${port}`);

});

