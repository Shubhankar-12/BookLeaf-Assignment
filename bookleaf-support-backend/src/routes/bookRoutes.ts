import { Router } from "express";
import { verifyJWT } from "../helpers/AuthMiddleware";
import { requireRole } from "../helpers/RoleMiddleware";
import { listBooksController } from "../use_cases/book/list";
import { getBookController } from "../use_cases/book/get";

// Admin elevation (not impersonation) — admins read books as themselves alongside the author surface.
export const bookRouter: Router = Router();

bookRouter.use(verifyJWT, requireRole("AUTHOR", "ADMIN"));
bookRouter.get("/", listBooksController.execute());
bookRouter.get("/:id", getBookController.execute());
