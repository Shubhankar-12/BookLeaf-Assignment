import { ListAdminTicketsController } from "./controller";
import { ListAdminTicketsUseCase } from "./usecase";

export const listAdminTicketsController = new ListAdminTicketsController(
  new ListAdminTicketsUseCase(),
);
