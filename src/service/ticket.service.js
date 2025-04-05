import { TicketRepository } from "../dao/repositories/tickets.repository.js";

class TicketService {
    constructor() {
        this.ticketRepository = new TicketRepository();
    }

    async createTicket(purchaseData) {
        return this.ticketRepository.createTicket(purchaseData);
    }
}
export default TicketService;

