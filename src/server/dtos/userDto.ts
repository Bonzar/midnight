import type { User } from "../models/User";

export class UserDto {
  id: number;
  email: string;
  isActivated: boolean;
  role: User["role"];

  constructor(model: User) {
    this.id = model.id;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.role = model.role;
  }
}
