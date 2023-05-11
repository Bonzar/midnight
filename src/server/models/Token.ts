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
import type {
  ModelAttr,
  ModelAttributesWithSelectedAssociations,
} from "../helpers/modelHelpers";
import { exhaustiveModelCheck } from "../helpers/modelHelpers";
import type { NotUndefined } from "../../../types/types";

export interface TokenAttributes {
  id: Token["id"];
  refreshToken: Token["refreshToken"];
  userId: Token["userId"];
}

interface TokenAssociationsAttributes {
  user: UserAttributes;
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

export type TokenAttributesWithAssociations<
  Associations extends keyof Omit<
    TokenAssociationsAttributes,
    keyof NestedAssociate
  >,
  NestedAssociate extends Partial<TokenAssociationsAttributes> = {}
> = ModelAttributesWithSelectedAssociations<
  TokenAttributes,
  TokenAssociationsAttributes,
  Associations,
  NestedAssociate
>;

exhaustiveModelCheck<
  NotUndefined<ModelAttr<Token>>,
  NotUndefined<TokenAttributes>,
  NotUndefined<TokenCreationAttributes>,
  NotUndefined<TokenAssociationsAttributes>
>();
