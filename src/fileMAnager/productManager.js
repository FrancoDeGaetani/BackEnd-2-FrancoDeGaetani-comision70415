import fs from 'fs/promises';


class ProductsManager  {

    constructor(){
        this.filePath = './Products.json';
    }

    async leerProductos() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            const products = JSON.parse(data);
            return Array.isArray(products) ? products : [];
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            } else {
                console.error('Error al leer producto:', error);
                throw error; 
            }
        }
    }

    async leerProducto(id) {
        try {
            const products = await this.leerProductos();
            return products.find(e => e.id === (id).toString());
        } catch (error) {
            console.error('Producto no encontrado:', error);
            throw error;
        }
    }

    async crearProducto(product) {
        try {         
            let products = await this.leerProductos();
            const newId = products.length > 0 ? Math.max(...products.map(p => parseInt(p.id))) + 1 : 1;
            
            products.push({...product, id : newId.toString()});

            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));

        } catch (error) {
            console.error('Error al crear un producto:', error);
            throw error;
        }
    }

    async eliminarProducto(id) {
        try {
            const products = await this.leerProductos();
            const productIndex = products.findIndex((e) => e.id === (id).toString());
        
            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }

            products.splice(productIndex, 1);

            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return { message: `Producto con ID ${id} eliminado exitosamente` };
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }

    async actualizarProducto(id , updatedProduct) {
        const products = await this.leerProductos();
        const productIndex = products.findIndex((e)=> e.id === (id).toString());

        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }
    
        products[productIndex] = { ...products[productIndex], ...updatedProduct };

        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        
        return products[productIndex];
    }
}

export default ProductsManager;