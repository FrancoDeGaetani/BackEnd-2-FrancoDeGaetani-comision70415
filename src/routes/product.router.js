import { Router } from "express";
import ProductModel from '../models/product.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        
        const { limit = 10, page = 1, sort, query } = req.query;

        let filter = {};
        if (query) {
            if (query === "disponible") {
                filter.status = true;
            } else {
                filter.category = query;
            }
        }

        const options = {
            limit: Math.max(parseInt(limit), 1) || 10,
            page: Math.max(parseInt(page), 1) || 1,
            sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
            lean: true, 
        };

        const result = await ProductModel.paginate(filter, options);

        const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
        const prevLink = result.hasPrevPage ? `${baseUrl}/?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query || ""}` : null;
        const nextLink = result.hasNextPage ? `${baseUrl}/?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query || ""}` : null;
        
        res.render('index', {
            products: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink,
            nextLink,
            baseUrl,
            style: 'product.css'
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener productos", error: error.message });
    }});


router.get('/:pid', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid);

        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);

    } catch (error) {
        res.status(500).json({ message: error.message });
}});
    

router.post('/', async (req, res) => {
        const product = new ProductModel(req.body);
    try {

        const newProduct = await product.save();

        res.status(201).json(newProduct);

    } catch (error) {
        res.status(400).json({ message: error.message });
}});
    

router.put('/:pid', async (req, res) => {
    try {

        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });

        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);

    } catch (error) {
        res.status(400).json({ message: error.message });
}});
    

router.delete('/:pid', async (req, res) => {
    try {

        const deletedProduct = await ProductModel.findByIdAndDelete(req.params.pid);

        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });

    } catch (error) {
        res.status(500).json({ message: error.message });
}});


export default router