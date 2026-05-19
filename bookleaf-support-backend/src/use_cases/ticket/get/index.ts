import { GetTicketController } from "./controller";
import { GetTicketUseCase } from "./usecase";

export const getTicketController = new GetTicketController(
  new GetTicketUseCase(),
);
