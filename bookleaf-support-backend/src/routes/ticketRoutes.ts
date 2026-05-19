import { Router } from "express";
import { verifyJWT } from "../helpers/AuthMiddleware";
import { requireRole } from "../helpers/RoleMiddleware";
import { createTicketController } from "../use_cases/ticket/create";
import { listTicketsController } from "../use_cases/ticket/list";
import { getTicketController } from "../use_cases/ticket/get";
import { addMessageController } from "../use_cases/ticket/add_message";

// Admin elevation (not impersonation) — overrides/assignment/notes live on /api/admin/tickets/*.
export const ticketRouter: Router = Router();

ticketRouter.use(verifyJWT, requireRole("AUTHOR", "ADMIN"));
ticketRouter.post("/", createTicketController.execute());
ticketRouter.get("/", listTicketsController.execute());
ticketRouter.get("/:id", getTicketController.execute());
ticketRouter.post("/:id/messages", addMessageController.execute());
