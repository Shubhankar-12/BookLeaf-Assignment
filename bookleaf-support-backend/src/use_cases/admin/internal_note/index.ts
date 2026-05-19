import { InternalNoteController } from "./controller";
import { InternalNoteUseCase } from "./usecase";

export const internalNoteController = new InternalNoteController(
  new InternalNoteUseCase(),
);
