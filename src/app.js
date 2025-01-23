import express from "express";
import productRouter from "./routes/product.router.js"
import cartsRouter from "./routes/carts.router.js"


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended : true}));

app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)


const server = app.listen(8080, ()=>console.log('escuchando'))