import { MeController } from "./controller";
import { MeUseCase } from "./usecase";

export const meController = new MeController(new MeUseCase());
