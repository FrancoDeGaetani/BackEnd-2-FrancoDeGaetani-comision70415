import Ticket from "../models/tickets.model.js";
import { v4 as uuidv4 } from "uuid";

export class TicketRepository {
    async createTicket(purchaseData) {
        try {
            const newTicket = new Ticket({
                code: uuidv4(), 
                purchase_datetime: new Date(),
                amount: purchaseData.amount,
                purchaser: purchaseData.purchaser
            });

            await newTicket.save();
            return newTicket;
        } catch (error) {
            throw new Error(`Error al crear el ticket: ${error.message}`);
        }
    }

    async getTicketById(ticketId) {
        return Ticket.findById(ticketId);
    }

    async getAllTickets() {
        return Ticket.find();
    }
}
