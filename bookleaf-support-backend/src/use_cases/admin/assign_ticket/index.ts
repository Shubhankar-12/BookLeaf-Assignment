import { AssignTicketController } from "./controller";
import { AssignTicketUseCase } from "./usecase";

export const assignTicketController = new AssignTicketController(
  new AssignTicketUseCase(),
);
