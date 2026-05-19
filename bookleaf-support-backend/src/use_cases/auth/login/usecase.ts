import { userQueries } from "../../../db/queries";
import { comparePassword } from "../../../utils/password";
import { signToken } from "../../../utils/token";
import type { UseCaseResult, Role } from "../../../types/api-response";
import type { LoginDto } from "./dto";

export interface LoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
}

export class LoginUseCase {
  async execute(dto: LoginDto): Promise<UseCaseResult<LoginResult>> {
    // getUserByEmail is the ONE query that returns the password hash.
    const user = await userQueries.getUserByEmail(dto.email);
    if (!user) {
      // Same message for both branches so we don't leak which half is wrong.
      return { error: "Invalid email or password" };
    }

    const ok = await comparePassword(dto.password, user.password);
    if (!ok) return { error: "Invalid email or password" };

    const id = user._id.toString();
    const token = signToken({ id, role: user.role, email: user.email });

    return {
      token,
      user: {
        id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
