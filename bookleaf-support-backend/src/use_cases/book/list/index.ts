import { ListBooksController } from "./controller";
import { ListBooksUseCase } from "./usecase";

export const listBooksController = new ListBooksController(
  new ListBooksUseCase(),
);
