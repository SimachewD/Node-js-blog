require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo');
const session = require('express-session');

const app = express();
const PORT = 3000;

connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({mongoUrl: process.env.MONGODB_URI}),
    //cookie: { maxAge: new Date(Date.now()+ (3600000))}
}));

app.use(express.static('public'));

//Templating engine
app.use(expressLayout);
app.set('layout', './layouts/main_layout');
app.set('view engine', 'ejs');



app.use('/', require('./server/routes/main_route'));
app.use('/', require('./server/routes/admin_route'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 