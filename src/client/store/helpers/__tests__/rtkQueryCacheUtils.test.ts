import { describe, test } from "vitest";
import {
  invalidateOnSuccess,
  invalidatesList,
  withArgAsId,
  withList,
  withNestedArgId,
  withNestedList,
} from "../rtkQueryCacheUtils";

describe("withNestedArgId", () => {
  test("should add tag with id arg extracted by 'extractId' callback", ({
    expect,
  }) => {
    const data = [{}, undefined, { id: "123" }] as const;
    type Arg = (typeof data)[2];

    const result = withNestedArgId("Basket", (arg: Arg) => arg.id)()(...data);

    expect(result).toEqual([{ type: "Basket", id: "123" }]);
  });

  test("should add tag if specified", ({ expect }) => {
    const data = [{}, undefined, { id: "123" }] as const;
    type Arg = (typeof data)[2];

    const result = withNestedArgId(
      "Basket",
      (arg: Arg) => arg.id
    )(["AUTHORIZED"])(...data);

    expect(result).toEqual(["AUTHORIZED", { type: "Basket", id: "123" }]);
  });
});

describe("withArgAsId", () => {
  test("should add tag from arg['id'] with specified type", ({ expect }) => {
    const data = [{}, undefined, "1"] as const;

    const result = withArgAsId("Basket")()(...data);

    expect(result).toEqual([{ type: "Basket", id: "1" }]);
  });

  test("should add tag if specified", ({ expect }) => {
    const data = [{}, undefined, "1"] as const;

    const result = withArgAsId("Basket")(["AUTHORIZED"])(...data);

    expect(result).toEqual(["AUTHORIZED", { type: "Basket", id: "1" }]);
  });
});

describe("withList", () => {
  test("should return tags with specified type, and ids from result", ({
    expect,
  }) => {
    const resultObject = [{ id: "1" }];

    const data = [resultObject, undefined, undefined] as const;

    const result = withList("Basket")()(...data);

    expect(result).toEqual([
      { type: "Basket", id: "LIST" },
      { type: "Basket", id: "1" },
    ]);
  });

  test("should have tag with specified type and id - LIST, when result rejected", ({
    expect,
  }) => {
    const data = [
      undefined,
      { status: "CUSTOM_ERROR", error: "" },
      undefined,
    ] as const;

    const result = withList("Basket")([])(...data);

    expect(result).toEqual([{ type: "Basket", id: "LIST" }]);
  });

  test("should add tag if specified", ({ expect }) => {
    const resultObject = [{ id: "1" }];
    const data = [resultObject, undefined, undefined] as const;

    const result = withList("Basket")(["AUTHORIZED"])(...data);

    expect(result).toEqual([
      "AUTHORIZED",
      { type: "Basket", id: "LIST" },
      { type: "Basket", id: "1" },
    ]);
  });
});

describe("withNestedList", () => {
  test("should return tags with specified type, and ids from result extracted by 'extractResult' callback", ({
    expect,
  }) => {
    const resultObject = { nested: { field: [{ id: "1" }] } };
    const data = [resultObject, undefined, undefined] as const;

    const result = withNestedList(
      "Basket",
      (result: typeof resultObject) => result.nested.field
    )()(...data);

    expect(result).toEqual([
      { type: "Basket", id: "LIST" },
      { type: "Basket", id: "1" },
    ]);
  });

  test("should have tag with specified type and id - LIST, when result rejected", ({
    expect,
  }) => {
    const resultObject = { nested: { field: [{ id: "1" }] } };
    const data = [
      undefined,
      { status: "CUSTOM_ERROR", error: "" },
      undefined,
    ] as const;

    const result = withNestedList(
      "Basket",
      (result: typeof resultObject) => result.nested.field
    )([])(...data);

    expect(result).toEqual([{ type: "Basket", id: "LIST" }]);
  });

  test("should add tag if specified", ({ expect }) => {
    const resultObject = { nested: { field: [{ id: "1" }] } };

    const data = [resultObject, undefined, undefined] as const;

    const result = withNestedList(
      "Basket",
      (result: typeof resultObject) => result.nested.field
    )(["AUTHORIZED"])(...data);

    expect(result).toEqual([
      "AUTHORIZED",
      { type: "Basket", id: "LIST" },
      { type: "Basket", id: "1" },
    ]);
  });
});

describe("invalidatesList", () => {
  test("should add tag with specified type and id - LIST", ({ expect }) => {
    const data = [{}, undefined, undefined] as const;

    const result = invalidatesList("Basket")()(...data);

    expect(result).toEqual([{ type: "Basket", id: "LIST" }]);
  });
});

describe("invalidateOnSuccess", () => {
  test("should add specified tags if result success", ({ expect }) => {
    const data = [{}, undefined, undefined] as const;

    const result = invalidateOnSuccess(["Basket"])(...data);

    expect(result).toEqual(["Basket"]);
  });

  test("should not add specified tags if result rejected", ({ expect }) => {
    const data = [
      undefined,
      { status: "CUSTOM_ERROR", error: "" },
      undefined,
    ] as const;

    const result = invalidateOnSuccess(["Basket"])(...data);

    expect(result).toEqual([]);
  });
});
