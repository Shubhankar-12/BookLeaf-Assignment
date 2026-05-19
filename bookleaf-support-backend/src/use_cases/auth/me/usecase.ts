import { userQueries } from "../../../db/queries";
import type { Role, UseCaseResult } from "../../../types/api-response";
import type { MeDto } from "./dto";

export interface MeResult {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export class MeUseCase {
  // Re-fetches instead of returning req.user so the response shape stays decoupled from the JWT cache.
  async execute(dto: MeDto): Promise<UseCaseResult<MeResult>> {
    const user = await userQueries.getUserById(dto.userId);
    if (!user) return { error: "User no longer exists" };
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
