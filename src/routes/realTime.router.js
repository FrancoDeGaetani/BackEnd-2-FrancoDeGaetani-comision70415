import { Router } from 'express';
import ProductsManager from "../fileMAnager/productManager.js";

const router = Router();
const productsManager = new ProductsManager ('./Products.json');


router.get('/realTimeProducts', async (req, res) => {
    res.render('realTimeProducts', { style : 'realTimeProducts.css' });
})

router.get('/', async (req, res) => {
    try {
        const productos = await productsManager.leerProductos();
        res.json(productos);

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await productsManager.eliminarProducto(id);
        res.json({ message: `Producto ${id} eliminado` });
        req.app.get('server').emit('productosActualizados', await productsManager.leerProductos());

    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});


export default router;
