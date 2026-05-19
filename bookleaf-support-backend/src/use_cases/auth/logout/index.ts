import { LogoutController } from "./controller";
import { LogoutUseCase } from "./usecase";

export const logoutController = new LogoutController(new LogoutUseCase());
