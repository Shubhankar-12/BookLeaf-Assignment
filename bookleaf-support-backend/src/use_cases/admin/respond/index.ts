import { AdminRespondController } from "./controller";
import { AdminRespondUseCase } from "./usecase";

export const respondController = new AdminRespondController(
  new AdminRespondUseCase(),
);
