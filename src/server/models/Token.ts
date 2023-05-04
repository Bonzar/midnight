import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import type { Optional } from "sequelize";
import type { UserCreationAttributes } from "./User";
import { User } from "./User";
import { exhaustiveModelCheck } from "../helpers/exhaustiveModelCheck";

interface TokenAttributes {
  id: Token["id"];
  refreshToken: Token["refreshToken"];
  userId: Token["userId"];
}

export type TokenCreationAttributes = Optional<
  Omit<TokenAttributes, "id">,
  never
> & {
  user?: UserCreationAttributes;
};

@Table
export class Token extends Model<TokenAttributes, TokenCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  refreshToken!: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}

exhaustiveModelCheck<TokenAttributes, TokenCreationAttributes, Token>(true);
