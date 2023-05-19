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
import type { ModelAttr } from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { NotUndefined } from "../../../types/types";

export interface TokenAttributes {
  id: Token["id"];
  serverToken: Token["serverToken"];
  userId: Token["userId"];
}

interface TokenAssociationsAttributes {
  user: UserAttributes;
}

export type TokenCreationAttributes = Optional<
  Omit<TokenAttributes, "id">,
  never
>;

interface TokenCreationAssociationsAttributes {
  user: UserCreationAttributes;
}

@Table
export class Token extends Model<
  TokenAttributes,
  TokenCreationAttributes & Partial<TokenCreationAssociationsAttributes>
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  serverToken!: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}

exhaustiveModelCheck<
  NotUndefined<ModelAttr<Token>>,
  NotUndefined<TokenAttributes>,
  NotUndefined<TokenCreationAttributes>,
  NotUndefined<TokenAssociationsAttributes>,
  NotUndefined<TokenCreationAssociationsAttributes>
>();
