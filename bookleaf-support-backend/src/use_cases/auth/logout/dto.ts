import type { AuthUser } from "../../../types/api-response";

export interface LogoutDto {
  userId: string;
}

export class LogoutDtoConverter {
  constructor(private readonly user: AuthUser) {}

  getDtoObject(): LogoutDto {
    return { userId: this.user.id };
  }
}
