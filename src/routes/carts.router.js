
import { Router } from "express";
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

const router = Router()

router.get("/", async (req, res) => {
    try {

        const carts = await CartModel.find().populate("products.product");
        res.json(carts);

    } catch (error) {
        res.status(500).json({ error: "Error al obtener los carritos", details: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    try {

        const { cid } = req.params;

        const cart = await CartModel.findById(cid).populate("products.product").lean();

        if (!cart) {
            return res.status(404).render("error", { message: "Carrito no encontrado" });
        }

        res.render("cart", { cart, style: "cart.css" });
    } catch (error) {
        res.status(500).render("error", { message: "Error al obtener el carrito" });
    }
});

router.post("/", async (req, res) => {
    try {

        const newCart = new CartModel({ products: [] });
        await newCart.save();

        res.status(201).json({ message: "Carrito creado con éxito", cart: newCart });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito", details: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {

        const { cid, pid } = req.params;
        const cart = await CartModel.findById(cid);
        const product = await ProductModel.findById(pid);

        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });

        const existingProduct = cart.products.find(p => p.product.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.json({ message: "Producto agregado al carrito", cart });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar producto al carrito", details: error.message });
    }
});


router.put("/:cid", async (req, res) => {
    try {
        
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        cart.products = products;
        await cart.save();

        res.json({ message: "Carrito actualizado con éxito", cart });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el carrito", details: error.message });
    }
});

router.put("/:cid/product/:pid", async (req, res) => {
    try {

        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
        }

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        res.json({ message: "Cantidad actualizada con éxito", cart });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la cantidad", details: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {

        const { cid, pid } = req.params;

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        cart.products = cart.products.filter(item => item.product.toString() !== pid);
        
        await cart.save();

        res.json({ message: "Producto eliminado del carrito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar producto", error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        
        const { cid } = req.params;

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        cart.products = [];
        await cart.save();

        res.json({ message: "Carrito vaciado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al vaciar el carrito", error: error.message });
    }
});


export default router