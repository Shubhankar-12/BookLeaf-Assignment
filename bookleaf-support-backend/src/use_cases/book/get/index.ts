import { GetBookController } from "./controller";
import { GetBookUseCase } from "./usecase";

export const getBookController = new GetBookController(new GetBookUseCase());
