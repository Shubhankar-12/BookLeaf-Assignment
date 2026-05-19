import { UpdateStatusController } from "./controller";
import { UpdateStatusUseCase } from "./usecase";

export const updateStatusController = new UpdateStatusController(
  new UpdateStatusUseCase(),
);
