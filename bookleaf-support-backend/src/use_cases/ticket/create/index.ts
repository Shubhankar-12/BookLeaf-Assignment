import { CreateTicketController } from "./controller";
import { CreateTicketUseCase } from "./usecase";

export const createTicketController = new CreateTicketController(
  new CreateTicketUseCase(),
);
