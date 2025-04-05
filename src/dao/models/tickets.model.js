import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
