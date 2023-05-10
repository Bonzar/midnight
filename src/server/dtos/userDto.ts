import type { User } from "../models/User";

export interface IUserDto {
  id: number;
  email: string;
  isActivated: boolean;
  role: User["role"];
}

export class UserDto implements IUserDto {
  id;
  email;
  isActivated;
  role;

  constructor(model: User) {
    this.id = model.id;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.role = model.role;
  }
}
