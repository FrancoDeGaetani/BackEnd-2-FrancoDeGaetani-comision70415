import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: "product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
}, { timestamps: true });

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel