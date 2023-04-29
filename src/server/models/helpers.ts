import { Attributes } from "sequelize";

export function exhaustiveModelCheck<
  ModelAttributes extends Attributes<any>,
  ModelInstance extends ModelAttributes
>() {
  return;
}
