import { Router } from "express";
import { authRouter } from "./authRoutes";
import { bookRouter } from "./bookRoutes";
import { ticketRouter } from "./ticketRoutes";
import { adminRouter } from "./adminRoutes";

// /healthz lives on the app root (not /api) so probes don't depend on the api prefix — see app.ts.
export const apiRouter: Router = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/books", bookRouter);
apiRouter.use("/tickets", ticketRouter);
apiRouter.use("/admin", adminRouter);
