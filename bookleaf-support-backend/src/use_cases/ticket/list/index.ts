import { ListTicketsController } from "./controller";
import { ListTicketsUseCase } from "./usecase";

export const listTicketsController = new ListTicketsController(
  new ListTicketsUseCase(),
);
