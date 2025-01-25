
import { Router } from "express";
import ProductsManager from '../fileMAnager/productManager.js';
import CartManager from "../fileMAnager/cartManager.js";

const router = Router()
const cartsManager = new CartManager('./Cart.json');
const productsManager = new ProductsManager('./products.json');

router.get('/', async (req,res) => {
    const products = await cartsManager.leerCarritos();
    res.json(products);
})

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartsManager.obtenerCartPorId(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito', details: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const newCart = await cartsManager.crearCarrito();
        res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito', details: error.message });
    }
});


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const product = await productsManager.leerProducto(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const updatedCart = await cartsManager.agregarProductoACart(req.params.cid, req.params.pid);
        res.json({ message: 'Producto agregado al carrito', cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito', details: error.message });
    }
});



export default router