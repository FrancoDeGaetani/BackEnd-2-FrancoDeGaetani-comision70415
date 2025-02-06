import { Server } from 'socket.io';
import ProductsManager from "../fileMAnager/productManager.js";

const productManager = new ProductsManager();

const configureSocket = (httpServer) => {
    
    const server = new Server(httpServer);

    
    server.on('connection', async (socket) => {
        console.log('Cliente conectado');

        socket.emit('productosActualizados', await productManager.leerProductos());

        socket.on('agregarProducto', async (producto) => {
            await productManager.crearProducto(producto);
            server.emit('productosActualizados', await productManager.leerProductos());
        });

        socket.on('eliminarProducto', async (id) => {
            await productManager.eliminarProducto(id);
            server.emit('productosActualizados', await productManager.leerProductos());
        });
    });

    return server;
};

export { Server, configureSocket };
