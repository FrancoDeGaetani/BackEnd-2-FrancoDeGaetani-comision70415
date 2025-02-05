import { Router } from "express";
import ProductsManager from "../fileMAnager/productManager.js";

const router = Router();

const productsManager = new ProductsManager ('./Products.json');


router.get('/', async (req,res) => {
    const products = await productsManager.leerProductos();
    res.json(products);
})

router.get('/products', async (req,res) => {
    const products = await productsManager.leerProductos();
    res.render('index', { products , style : 'product.css' });
})

router.get('/:id',async (req,res)=>{

    const product = await productsManager.leerProducto(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado00' });
    res.json(product);

})


router.post('/', async (req, res)=>{

    const { title, description, code, price, status, stock, category, thumbnails  } = req.body;
    if (!title||!description||!code||!price||!status||!stock||!category||!thumbnails) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios: name, price, description, stock' });
    }

    const newProduct = { title, description, code, price, status, stock, category, thumbnails };

    try {
        await productsManager.crearProducto(newProduct);
        res.status(201).json({ message: 'Producto agregado con éxito', product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto', details: error.message });
    }
})

router.put('/:id', async (req, res)=>{

    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const updatedProduct = { title, description, code, price, status, stock, category, thumbnails };

    try {
        const result = await productsManager.actualizarProducto(req.params.id, updatedProduct);

        if (!result) return res.status(404).json({ error: 'Producto no encontrado' });

        res.json({ message: 'Producto actualizado con éxito', product: result });

    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
    }
})

router.delete('/:id',async (req, res)=>{

    try {
            const result = await productsManager.eliminarProducto(req.params.id);
            
            if (!result){
                return res.status(404).json({ error: 'Producto no encontrado' })};

            res.json({ message: 'Producto eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
        }


})

export default router