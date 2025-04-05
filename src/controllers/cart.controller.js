import CartModel from "../dao/models/cart.model.js";
import ProductModel from "../dao/models/product.model.js";
import Ticket from "../dao/models/tickets.model.js";

export const checkoutCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const userEmail = req.user.email;
        
        const cart = await CartModel.findById(cid).populate("products.product");
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

        let totalAmount = 0;
        let productsToPurchase = [];
        let productsFailed = [];

        for (const item of cart.products) {
            const product = item.product;

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                totalAmount += product.price * item.quantity;
                productsToPurchase.push(item);
            } else {
                productsFailed.push(item.product._id);
            }
        }

        let ticket = null;
        if (productsToPurchase.length > 0) {
            ticket = await TicketService.createTicket(userEmail, totalAmount);
        }

        cart.products = cart.products.filter(item => productsFailed.includes(item.product._id.toString()));
        await cart.save();

        res.json({
            message: "Compra procesada",
            ticket: ticket || "No se generó ticket (sin productos disponibles)",
            remainingCart: cart,
            failedProducts: productsFailed
        });

    } catch (error) {
        res.status(500).json({ error: "Error al procesar la compra", details: error.message });
    }
};
