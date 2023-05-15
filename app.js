require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const userRouter = require('./Routes/user');
const gridRouter = require('./Routes/trades');
const premiumRouter = require('./Routes/Premium');

const app = express();
app.use(express.json());
app.set('trust proxy', true);

// app.use(
// 	cors({
// 		origin: '*',
// 		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// 		preflightContinue: false,
// 		optionsSuccessStatus: 204,
// 	})
// );

// origin: 'https://frontend-btq.onrender.com'
app.use(
	cors({
		origin: 'https://btqtesters.netlify.app',
		allowedHeaders: '*',
		allowMethods: '*',
	})
);
// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	next();
// });

app.use(userRouter);
app.use(gridRouter);
app.use(premiumRouter);
// -- connect to a db
// -- Sign Up User
// -- Sign in User
// -- get User Profile
// --update count

module.exports = app;
