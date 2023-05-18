import { describe, test } from "vitest";
import {
  withArgAsId,
  withErrorTags,
  withIdFromArg,
  withList,
  withNestedList,
} from "../rtkQueryCacheUtils";

describe("withErrorTags", () => {
  test("should add tag on success result", ({ expect }) => {
    const result = withErrorTags(["Basket"])({}, {}, undefined);

    expect(result).toEqual(["Basket"]);
  });

  test("should do nothing if empty and success", ({ expect }) => {
    const result = withErrorTags([])({}, {}, undefined);

    expect(result).toEqual([]);
  });

  test("should return unknown error tag on rejected result", ({ expect }) => {
    const result = withErrorTags([])(undefined, { status: 404 }, undefined);

    expect(result).toEqual(["UNKNOWN_ERROR"]);
  });

  test("should return unauthorized error tag on rejected result (401 status)", ({
    expect,
  }) => {
    const result = withErrorTags([])(undefined, { status: 401 }, undefined);

    expect(result).toEqual(["UNAUTHORIZED"]);
  });

  test("should add tag if specified", ({ expect }) => {
    const data = [{}, undefined, { id: "123" }] as const;

    const result = withErrorTags(["AUTHORIZED"])(...data);

    expect(result).toEqual(["AUTHORIZED"]);
  });
});

describe("cacheByIdArgProperty", () => {
  test("should add tag from arg['id'] with specified type on success result", ({
    expect,
  }) => {
    const data = [{}, undefined, { id: "123" }] as const;

    const result = withIdFromArg("Basket")([])(...data);

    expect(result).toEqual([{ type: "Basket", id: "123" }]);
  });

  test("should add error tag if result rejected", ({ expect }) => {
    const data = [undefined, { status: 401 }, { id: "123" }] as const;

    const result = withIdFromArg("Basket")([])(...data);

    expect(result).toEqual(["UNAUTHORIZED", { type: "Basket", id: "123" }]);
  });

  test("should add tag if specified", ({ expect }) => {
    const data = [{}, undefined, { id: "123" }] as const;

    const result = withIdFromArg("Basket")(["AUTHORIZED"])(...data);

    expect(result).toEqual([{ type: "Basket", id: "123" }, "AUTHORIZED"]);
  });
});

describe("cacheByIdArg", () => {
  test("should add tag from arg['id'] with specified type on success result", ({
    expect,
  }) => {
    const data = [{}, undefined, "000"] as const;

    const result = withArgAsId("Basket")([])(...data);

    expect(result).toEqual([{ type: "Basket", id: "000" }]);
  });

  test("should add error tag if result rejected", ({ expect }) => {
    const data = [undefined, {}, "000"] as const;

    const result = withArgAsId("Basket")([])(...data);

    expect(result).toEqual(["UNKNOWN_ERROR", { type: "Basket", id: "000" }]);
  });

  test("should add tag if specified", ({ expect }) => {
    const data = [{}, undefined, "000"] as const;

    const result = withArgAsId("Basket")(["AUTHORIZED"])(...data);

    expect(result).toEqual([{ type: "Basket", id: "000" }, "AUTHORIZED"]);
  });
});

describe("providesList", () => {
  test("should return LIST and ids tags for type", ({ expect }) => {
    const resultObject = [{ id: "1" }];

    const data = [resultObject, undefined, undefined] as const;

    const result = withList("Basket")([])(...data);

    expect(result).toEqual([
      { type: "Basket", id: "LIST" },
      { type: "Basket", id: "1" },
    ]);
  });

  test("should add error tag if result rejected and have LIST tag", ({
    expect,
  }) => {
    const data = [undefined, { error: "SOME_ERROR" }, undefined] as const;

    const result = withList("Basket")([])(...data);

    expect(result).toEqual(["UNKNOWN_ERROR", { type: "Basket", id: "LIST" }]);
  });

  test("should add tag if specified", ({ expect }) => {
    const resultObject = [{ id: "1" }];

    const data = [resultObject, undefined, undefined] as const;

    const result = withList("Basket")(["AUTHORIZED"])(...data);

    expect(result).toEqual([
      { type: "Basket", id: "LIST" },
      { type: "Basket", id: "1" },
      "AUTHORIZED",
    ]);
  });
});

describe("providesNestedList", () => {
  test("should return only error tag if result rejected", ({ expect }) => {
    const resultObject = { nested: { field: [{ id: "TEST" }] } };

    const data = [resultObject, { status: 200 }, undefined] as const;

    const result = withNestedList(
      "Basket",
      (result: typeof resultObject) => result.nested.field,
      []
    )(...data);

    expect(result).toEqual([
      { type: "Basket", id: "LIST" },
      { type: "Basket", id: "TEST" },
    ]);
  });

  test("should add tag if specified", ({ expect }) => {
    const resultObject = { nested: { field: [{ id: "TEST" }] } };

    const data = [resultObject, { status: 200 }, undefined] as const;

    const result = withNestedList(
      "Basket",
      (result: typeof resultObject) => result.nested.field,
      () => ["AUTHORIZED"]
    )(...data);

    expect(result).toEqual([
      { type: "Basket", id: "LIST" },
      { type: "Basket", id: "TEST" },
      "AUTHORIZED",
    ]);
  });

  test("should add error tag if result rejected", ({ expect }) => {
    const resultObject = { nested: { field: [{ id: "TEST" }] } };

    const data = [undefined, { status: 200 }, undefined] as const;

    const result = withNestedList(
      "Basket",
      (result: typeof resultObject) => result.nested.field,
      []
    )(...data);

    expect(result).toEqual(["UNKNOWN_ERROR", { type: "Basket", id: "LIST" }]);
  });
});
