import { Router } from "express";
import { ProductRepository } from "../dao/repositories/product.repository.js";
import { authorization } from "../middlewares/authorization.js";
import { passportCall } from "../middlewares/passportCall.js";
import ProductModel from "../dao/models/product.model.js";

const router = Router();
const productRepository = new ProductRepository();

router.get("/", async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.json(products);
        
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos", details: error.message });
    }
});

router.post("/", passportCall("jwt"), authorization("admin"), async (req, res) => {
    try {
        const product = await productRepository.create(req.body);
        res.status(201).json(product);

    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto", details: error.message });
    }
});

router.put("/:pid", passportCall("jwt"), authorization("admin"), async (req, res) => {
    try {
        const product = await productRepository.update(req.params.pid, req.body);
        res.json(product);

    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

router.delete("/:pid", passportCall("jwt"), authorization("admin"), async (req, res) => {
    try {
        await productRepository.delete(req.params.pid);
        res.json({ message: "Producto eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default router;
