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
import type { UserAttributes, UserCreationAttributes } from "./User";
import { User } from "./User";
import type { ModelKeys } from "../helpers/exhaustiveModelCheck";
import { keysCheck } from "../helpers/exhaustiveModelCheck";

interface TokenBaseAttributes {
  id: Token["id"];
  refreshToken: Token["refreshToken"];
  userId: Token["userId"];
}

interface TokenAssociationsAttributes {
  user: UserAttributes;
}

export type TokenCreationAttributes = Optional<
  Omit<TokenBaseAttributes, "id">,
  never
> & {
  user?: UserCreationAttributes;
};

@Table
export class Token extends Model<TokenBaseAttributes, TokenCreationAttributes> {
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

export type TokenAttributes = TokenBaseAttributes &
  Partial<TokenAssociationsAttributes>;

keysCheck<ModelKeys<Token>, keyof TokenAttributes>();
keysCheck<TokenAttributes, keyof ModelKeys<Token>>();
keysCheck<TokenCreationAttributes, keyof Omit<ModelKeys<Token>, "id">>();
