import { UpdateCategoryController } from "./controller";
import { UpdateCategoryUseCase } from "./usecase";

export const updateCategoryController = new UpdateCategoryController(
  new UpdateCategoryUseCase(),
);
