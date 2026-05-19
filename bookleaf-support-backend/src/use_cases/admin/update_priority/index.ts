import { UpdatePriorityController } from "./controller";
import { UpdatePriorityUseCase } from "./usecase";

export const updatePriorityController = new UpdatePriorityController(
  new UpdatePriorityUseCase(),
);
