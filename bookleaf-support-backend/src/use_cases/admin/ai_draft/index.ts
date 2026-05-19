import { AiDraftController } from "./controller";
import { AiDraftUseCase } from "./usecase";

export const aiDraftController = new AiDraftController(new AiDraftUseCase());
