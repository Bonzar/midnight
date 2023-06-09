import React from "react";
import { renderHook, act } from "@testing-library/react";
import useCounter from "./testingHook";
import { describe, test } from "vitest";
describe("demo", () => {
  test("should be testable", ({ expect }) => {
    expect(1 + 1).toBe(2);
  });
  test("should be able to test hook", ({ expect }) => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });
});
