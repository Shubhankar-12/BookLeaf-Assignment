import { Router } from "express";
import { verifyJWT } from "../helpers/AuthMiddleware";
import { requireRole } from "../helpers/RoleMiddleware";
import { listAdminTicketsController } from "../use_cases/admin/list_tickets";
import { getAdminTicketController } from "../use_cases/admin/get_ticket";
import { updateStatusController } from "../use_cases/admin/update_status";
import { updateCategoryController } from "../use_cases/admin/update_category";
import { updatePriorityController } from "../use_cases/admin/update_priority";
import { assignTicketController } from "../use_cases/admin/assign_ticket";
import { respondController } from "../use_cases/admin/respond";
import { internalNoteController } from "../use_cases/admin/internal_note";
import { aiDraftController } from "../use_cases/admin/ai_draft";

export const adminRouter: Router = Router();

adminRouter.use(verifyJWT, requireRole("ADMIN"));

adminRouter.get("/tickets", listAdminTicketsController.execute());
adminRouter.get("/tickets/:id", getAdminTicketController.execute());
adminRouter.patch("/tickets/:id/status", updateStatusController.execute());
adminRouter.patch("/tickets/:id/category", updateCategoryController.execute());
adminRouter.patch("/tickets/:id/priority", updatePriorityController.execute());
adminRouter.patch("/tickets/:id/assign", assignTicketController.execute());
adminRouter.post("/tickets/:id/respond", respondController.execute());
adminRouter.post(
  "/tickets/:id/internal-note",
  internalNoteController.execute(),
);
adminRouter.post("/tickets/:id/ai-draft", aiDraftController.execute());
