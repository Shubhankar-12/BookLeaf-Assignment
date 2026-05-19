import { GetAdminTicketController } from "./controller";
import { GetAdminTicketUseCase } from "./usecase";

export const getAdminTicketController = new GetAdminTicketController(
  new GetAdminTicketUseCase(),
);
