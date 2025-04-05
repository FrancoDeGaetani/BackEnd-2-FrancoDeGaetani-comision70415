import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { configureSocket } from './sockets/sockets.js';

import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/carts.router.js";
import realRouter from "./routes/realTime.router.js";
import sessionsRouter from "./routes/session.router.js"

import mongoose from 'mongoose'; 
import dotenv from "dotenv";
dotenv.config();

import passport from "./config/passport.config.js";
import cookieParser from 'cookie-parser';
import initializePassport from "../src/config/passport.config.js";

const app = express();
const httpServer = app.listen(8080, ()=>console.log('escuchando'))
const socketServer = configureSocket(httpServer);

app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(express.static( __dirname + '/public'))

app.use(cookieParser());
app.use(passport.initialize()); 

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter); 
app.use('/products', realRouter);


const URIMongoDB = process.env.URIMongoDB

mongoose.connect(URIMongoDB)
    .then( () => console.log("Conexión a base de datos exitosa"))
    .catch( (error) => {
        console.error("Error en conexión: ", error);
        process.exit();
    });






