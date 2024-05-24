const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars');
const methodOverrride = require('method-override');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

const route = require('./routes');
const db = require('./config/db');
const { COOKIE_MAX_AGE } = require('./config/constants');

const app = express();
const port = 3000;

//Connect DB
db.connect();

app.use(methodOverrride('_method'));
app.use(session({
    cookie: {
        maxAge: COOKIE_MAX_AGE,
    },
    secret: 'woot',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://dinovu285:zxcvbnm1@cluster0.aao9q92.mongodb.net/petshop',
    }),
}));
app.use(flash());
app.use(cookieParser());

//Process static file
app.use(express.static(path.join(__dirname, 'public')));

//Process input data to server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Templete engine
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            equal: (a, b) => a == b,
            formatCurrency: (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number),
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//Router
route(app);

// 127.0.0.1 - localhost
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
