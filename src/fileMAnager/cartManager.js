import fs from 'fs/promises';


class CartManager  {

    constructor(){
        this.filePath = './Cart.json';
    }

    async guardarCarritos(carts) {
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    }

    async leerCarritos() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            const carts = JSON.parse(data);
            return Array.isArray(carts) ? carts : [];
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            } else {
                console.error('Error al leer el carrito:', error);
                throw error; 
            }
        }
    }

    async leerCarrito(id) {
        try {
            const carts = await this.leerCarritos();
            return carts.find(e => e.id === (id).toString());
        } catch (error) {
            console.error('Carrito no encontrado:', error);
            throw error;
        }
    }

    async crearCarrito() {
        const carts = await this.leerCarritos();
        const lastId = carts.length > 0 ? Math.max(...carts.map(c => parseInt(c.id) || 0)) : 0;

        const newCart = {
            id: (lastId + 1).toString(),
            products: [],
        };


        carts.push(newCart);
        
        await this.guardarCarritos(carts);
        return newCart;
    }

    async agregarProductoACart(cartId, productId) {
        const carts = await this.leerCarritos();
        const cart = carts.find(e => e.id ===(cartId).toString());

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.guardarCarritos(carts);
        return cart;
    }

}

export default CartManager;