import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "./sockets/sockets.js";
import { configureSocket } from './sockets/sockets.js';

import productRouter from "./routes/product.router.js";
import cartsRouter from "./routes/carts.router.js";
import realRouter from "./routes/realTime.router.js";



const app = express();
const httpServer = app.listen(8080, ()=>console.log('escuchando'))
const socketServer = configureSocket(httpServer);


app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(express.static( __dirname + '/public'))

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/cart', cartsRouter)
app.use('/', productRouter);
app.use('/products', realRouter);

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {style: 'realTime.css'});
});



