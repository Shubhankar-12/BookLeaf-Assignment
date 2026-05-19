import type { LoginRequest } from "./request";

export interface LoginDto {
  email: string;
  password: string;
}

export class LoginDtoConverter {
  constructor(private readonly request: LoginRequest) {}

  getDtoObject(): LoginDto {
    return {
      email: this.request.email.toLowerCase().trim(),
      password: this.request.password,
    };
  }
}
