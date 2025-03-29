import { Router } from "express";
import { TicketController } from "../../controllers/user/user.ticket.controller";

const router = Router();

router.get("/event/:id_event/ticket/:id_ticket_type/availability", TicketController.getTicketAvailability);

export default router;
