import type { AuthUser } from "../../../types/api-response";

export interface MeDto {
  userId: string;
}

export class MeDtoConverter {
  constructor(private readonly user: AuthUser) {}

  getDtoObject(): MeDto {
    return { userId: this.user.id };
  }
}
