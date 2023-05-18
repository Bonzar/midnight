import { has } from "ramda";
import type { TagTypes } from "../apiSlice";

export type CacheItem<
  T extends TagTypes,
  ID extends string | void = void
> = ID extends void ? T : { type: T; id: ID };

/**
 * A list of cache items, including a LIST entity cache
 */
export type CacheList<T extends TagTypes, ID extends string | void> = CacheItem<
  T,
  ID
>[];

type TagsList = Readonly<CacheList<TagTypes, string | void>>;

/**
 * HOF creator that accept HOF callback and return tags HOF
 * As result will concat tags from HOF callback and from wrapped tags callback
 */
const createTagsHOF =
  <HOFResult, HOFError, HOFArg, Tags extends TagsList>(
    HOFCallback: (result: HOFResult, error: HOFError, arg: HOFArg) => Tags
  ) =>
  <
    Result extends HOFResult,
    Error extends HOFError,
    Arg extends HOFArg,
    CallbackTags extends TagsList
  >(
    tags:
      | CallbackTags
      | ((result: Result, error: Error, arg: Arg) => CallbackTags)
  ) =>
  (result: Result, error: Error, arg: Arg) => {
    let callbackTags;
    if (typeof tags === "function") {
      callbackTags = tags(result, error, arg);
    } else {
      callbackTags = tags;
    }

    return [...HOFCallback(result, error, arg), ...callbackTags];
  };

/**
 * HOF that provide error tags when result isn't success
 * Have UNAUTHORIZED for 401 status in error and UNKNOWN_ERROR for others
 *
 * @example
 * ```ts
 * withErrorTags([])(undefined, {status: 401}, undefined)
 * // returns:
 * // ["UNAUTHORIZED"]
 * ```
 */
export const withErrorTags = createTagsHOF((result, error) => {
  // is result available?
  if (result) {
    // successful query
    return [];
  }

  let errorTag;
  // Received an error, include an error cache item to the cache list
  if (has("status", error) && error.status === 401) {
    // unauthorized error
    errorTag = "UNAUTHORIZED" as const;
  } else {
    errorTag = "UNKNOWN_ERROR" as const;
  }

  return [errorTag];
});

/**
 * Wrap createTagsHOF with withErrorTags
 */
const createTagsHOFWithErrors = <Result, Error, Arg, Tags extends TagsList>(
  HOFCallback: (result: Result, error: Error, arg: Arg) => Tags
) => createTagsHOF(withErrorTags(HOFCallback));

/**
 * HOF to create an entity cache to provide a LIST,
 * depending on the results being in a common format.
 *
 * Will not provide individual items without a result.
 *
 * @example
 * ```ts
 * const results = [
 *   { id: 1, message: 'foo' },
 *   { id: 2, message: 'bar' }
 * ]
 * providesList('Todo')([])(results)
 * // [
 * //   { type: 'Todo', id: 'LIST'},
 * //   { type: 'Todo', id: 1 },
 * //   { type: 'Todo', id: 2 },
 * // ]
 * ```
 */
export const withList = <
  Result extends { id: string }[] | undefined,
  T extends TagTypes
>(
  type: T
) =>
  createTagsHOFWithErrors((result: Result) => {
    if (!result) {
      return [{ type, id: "LIST" as const }];
    }

    return [
      { type, id: "LIST" as const },
      ...result.map(({ id }) => ({ type, id })),
    ];
  });

/**
 * Similar to `providesList`, but for data located at a nested property,
 * e.g. `results.data` in a paginated response.
 */
export const withNestedList = <
  Result,
  Error,
  Arg,
  Data extends Array<Record<"id", string>>,
  Tags extends TagsList,
  Type extends TagTypes
>(
  type: Type,
  extractFromResult: (result: Result) => Data,
  tags: ((result: Result, error: Error, arg: Arg) => Tags) | Tags
) =>
  withErrorTags((result: Result | undefined, error: Error, arg: Arg) => {
    if (!result) {
      return [{ type, id: "LIST" }];
    }

    const data = extractFromResult(result);

    const listTags = [
      { type, id: "LIST" as const },
      ...data.map(({ id }) => ({ type, id })),
    ];

    if (typeof tags === "function") {
      return [...listTags, ...tags(result, error, arg)];
    }

    return [...listTags, ...tags];
  });

/**
 * HOF to create an entity cache for a single item using the query argument as the ID.
 *
 * @example
 * ```ts
 * cacheByIdArg('Todo')([])({ id: 5, message: 'walk the fish' }, undefined, 5)
 * // returns:
 * // [{ type: 'Todo', id: 5 }]
 * ```
 */
export const withIdAsArg = <Arg extends string, T extends TagTypes>(type: T) =>
  createTagsHOFWithErrors((result, error, arg: Arg) => {
    return [{ type, id: arg }];
  });

/**
 * HOF to create an entity cache for a single item using the id property from the query argument as the ID.
 *
 * @example
 * ```ts
 * cacheByIdArgProperty('Todo')([])(undefined, { id: 5, message: 'sweep up' })
 * // returns:
 * // [{ type: 'Todo', id: 5 }]
 * ```
 */
export const withIdFromArg = <Arg extends { id: string }, T extends TagTypes>(
  type: T
) =>
  createTagsHOFWithErrors((result, error, arg: Arg) => {
    return [{ type, id: arg.id }];
  });

/**
 * HOF to create an entity cache to invalidate a LIST.
 *
 * Invalidates regardless of result.
 *
 * @example
 * ```ts
 * invalidatesList('Todo')([])
 * // [{ type: 'Todo', id: 'LIST' }]
 * ```
 */
export const invalidatesList = <T extends TagTypes>(type: T) =>
  createTagsHOF(() => [{ type, id: "LIST" as const }]);

/**
 * HOF to invalidate the 'UNAUTHORIZED' type cache item.
 */
export const invalidatesUnauthorized = createTagsHOF(() => ["UNAUTHORIZED"]);

/**
 * HOF to invalidate the 'UNKNOWN_ERROR' type cache item.
 */
export const invalidatesUnknownError = createTagsHOF(() => ["UNKNOWN_ERROR"]);
