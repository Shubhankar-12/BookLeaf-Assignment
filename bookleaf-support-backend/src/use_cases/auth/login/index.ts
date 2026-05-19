import { LoginController } from "./controller";
import { LoginUseCase } from "./usecase";

export const loginController = new LoginController(new LoginUseCase());
