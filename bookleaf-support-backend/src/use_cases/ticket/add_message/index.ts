import { AddMessageController } from "./controller";
import { AddMessageUseCase } from "./usecase";

export const addMessageController = new AddMessageController(
  new AddMessageUseCase(),
);
