import type { UseCaseResult } from "../../../types/api-response";
import type { LogoutDto } from "./dto";

export interface LogoutResult {
  loggedOut: true;
}

// Stateless logout — no server-side token store. Revocation would require switching to short-lived + refresh tokens.
export class LogoutUseCase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_dto: LogoutDto): Promise<UseCaseResult<LogoutResult>> {
    return { loggedOut: true };
  }
}
