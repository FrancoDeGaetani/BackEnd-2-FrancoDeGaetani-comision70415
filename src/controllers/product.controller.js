import { ProductRepository } from "../dao/repositories/product.repository.js";

const productRepository = new ProductRepository();

export const getAllProducts = async (req, res) => {
    try {
        const products = await productRepository.getAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
};
