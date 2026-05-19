import { Router } from "express";
import { loginController } from "../use_cases/auth/login";
import { meController } from "../use_cases/auth/me";
import { logoutController } from "../use_cases/auth/logout";
import { verifyJWT } from "../helpers/AuthMiddleware";
import { loginRateLimiter } from "../helpers/RateLimitMiddleware";

export const authRouter: Router = Router();

authRouter.post("/login", loginRateLimiter, loginController.execute());
authRouter.post("/logout", verifyJWT, logoutController.execute());
authRouter.get("/me", verifyJWT, meController.execute());
