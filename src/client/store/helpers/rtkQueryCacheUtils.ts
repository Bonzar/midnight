import type { TagTypes } from "../apiSlice";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type CacheID = string | number;

type TagsResult = unknown | undefined;
type TagsError = FetchBaseQueryError | undefined;
type TagsArg = unknown;

type CacheItem = TagTypes | { type: TagTypes; id: CacheID };

type ProvidingTags<R extends TagsResult, A extends TagsArg> =
  | ((result: R, error: TagsError, arg: A) => CacheItem[])
  | CacheItem[];

type TagsGetter<R extends TagsResult, A extends TagsArg> = (
  result: R,
  error: TagsError,
  arg: A
) => CacheItem[];

function getTags<R extends TagsResult, A extends TagsArg>(
  result: R,
  error: TagsError,
  arg: A
): (tags?: ProvidingTags<R, A>) => CacheItem[] {
  return (tags: ProvidingTags<R, A> | undefined) => {
    if (!tags) return [];

    if (typeof tags === "function") {
      return tags(result, error, arg);
    }

    return tags;
  };
}

function connectTags<R extends TagsResult, A extends TagsArg>(
  result: R,
  error: TagsError,
  arg: A
) {
  return (tagsLeft: ProvidingTags<R, A> | undefined) =>
    (tagsRight: ProvidingTags<R, A> | undefined) => {
      const tagsGetter = getTags(result, error, arg);

      return [...tagsGetter(tagsLeft), ...tagsGetter(tagsRight)];
    };
}

/**
 * HOF creator that accept addition tags and return tags getter, that will concat additional tags
 */
function createTagsGetter<HOF_R extends TagsResult, HOF_A extends TagsArg>(
  providingTags: ProvidingTags<HOF_R, HOF_A>
) {
  return <R extends HOF_R, A extends HOF_A>(
      tags?: ProvidingTags<R, A>
    ): TagsGetter<R, A> =>
    (result, error, arg) =>
      connectTags(result, error, arg)(tags)(providingTags);
}

/**
 * HOF to create an entity cache to provide a LIST,
 * depending on the results.
 *
 * Will not provide individual items without a result.
 *
 * @example ```ts
 * const results = [
 *   { id: 1, message: 'foo' },
 *   { id: 2, message: 'bar' }
 * ]
 * withList('Product')()(results)
 * // [
 * //   { type: 'Product', id: 'LIST'},
 * //   { type: 'Product', id: 1 },
 * //   { type: 'Product', id: 2 },
 * // ]
 * ```
 */
export function withList<
  R extends Record<"id", CacheID>[] | undefined,
  A extends TagsArg
>(type: TagTypes) {
  return createTagsGetter<R, A>((result) => {
    if (!result) {
      return [{ type, id: "LIST" }];
    }

    return [{ type, id: "LIST" }, ...result.map(({ id }) => ({ type, id }))];
  });
}

/**
 * HOF to create an entity cache to provide a LIST,
 * depending on the results.
 *
 * Extracted nested data from result
 *
 * Will not provide individual items without a result.
 *
 * @example ```ts
 * const results = { nestedResult: [
 *   { id: 1, message: 'foo' },
 *   { id: 2, message: 'bar' }
 * ]}
 * withNestedList('Product', result => result.nestedResult)()(results)
 * // [
 * //   { type: 'Product', id: 'LIST'},
 * //   { type: 'Product', id: 1 },
 * //   { type: 'Product', id: 2 },
 * // ]
 * ```
 */
export function withNestedList<
  Data extends Record<"id", CacheID>[],
  R extends TagsResult,
  A extends TagsArg
>(type: TagTypes, extractList: (result: NonNullable<R>) => Data) {
  return createTagsGetter<R | undefined, A>((result) => {
    if (!result) {
      return [{ type, id: "LIST" }];
    }

    const list = extractList(result);

    return [{ type, id: "LIST" }, ...list.map(({ id }) => ({ type, id }))];
  });
}

/**
 * HOF to create an entity cache to provide a LIST,
 * depending on the results.
 *
 * 1. Extracted list data from result
 * 2. Extracted tag id from list item
 *
 * Will not provide individual items without a result.
 *
 * @example ```ts
 * const results = { nestedResult: [
 *   { productId: 1, message: 'foo' },
 *   { productId: 2, message: 'bar' }
 * ]}
 * withDeepNestedList('Product', result => result.nestedResult, item => item.productId)()(results)
 * // [
 * //   { type: 'Product', id: 'LIST'},
 * //   { type: 'Product', id: 1 },
 * //   { type: 'Product', id: 2 },
 * // ]
 * ```
 */
export function withDeepNestedList<
  Data extends Record<string, unknown>[],
  R extends TagsResult,
  A extends TagsArg
>(
  type: TagTypes,
  extractList: (result: NonNullable<R>) => Data,
  extractId: (item: Data[number]) => CacheID
) {
  return createTagsGetter<R | undefined, A>((result) => {
    if (!result) {
      return [{ type, id: "LIST" }];
    }

    const list = extractList(result);

    return [
      { type, id: "LIST" },
      ...list.map((item) => ({ type, id: extractId(item) })),
    ];
  });
}

/**
 * HOF to add tag with specified type and arg as id.
 *
 * @example ```ts
 * withArgAsId('Product')()({ id: 5, message: 'walk the fish' }, undefined, 5)
 * // [{ type: 'Product', id: 5 }]
 * ```
 */
export function withArgAsId<R extends TagsResult, A extends CacheID>(
  type: TagTypes
) {
  return createTagsGetter<R, A>((result, error, arg) => {
    return [{ type, id: arg }];
  });
}

/**
 * HOF to add tag with specified type and id extracted from arg.
 *
 * @example ```ts
 * withNestedArgId('Product', (arg) => arg.id)()(undefined, undefined, { id: 5 })
 * // [{ type: 'Product', id: 5 }]
 * ```
 */
export function withNestedArgId<R extends TagsResult, A extends TagsArg>(
  type: TagTypes,
  extractId: (arg: A) => CacheID
) {
  return createTagsGetter<R, A>((result, error, arg) => {
    const id = extractId(arg);

    return [{ type, id }];
  });
}

/**
 * HOF to add tag with specified type and id extracted from result.
 *
 * @example ```ts
 * withNestedArgId('Product', (res) => res.id)()({ id: 5 }, undefined, undefined)
 * // [{ type: 'Product', id: 5 }]
 * ```
 */
export function withNestedResultId<R extends TagsResult, A extends TagsArg>(
  type: TagTypes,
  extractId: (result: R) => CacheID
) {
  return createTagsGetter<R | undefined, A>((result) => {
    if (!result) {
      return [];
    }

    const id = extractId(result);

    return [{ type, id }];
  });
}

/**
 * HOF to add tag with id LIST
 *
 * @example ```ts
 * invalidatesList('Product')()
 * // [{ type: 'Product', id: 'LIST' }]
 * ```
 */
export function invalidatesList(type: TagTypes) {
  return createTagsGetter([{ type, id: "LIST" }]);
}

/**
 * HOF to invalidate specified tags on success request
 * @example ```ts
 * invalidateOnSuccess(['Product'])({ some: "data" }, undefined, undefined )
 * // ['Product']
 *
 * invalidateOnSuccess(['Product'])(undefined, {status: 401, error: ""}, undefined )
 * // []
 * ```
 */
export function invalidateOnSuccess<R extends TagsResult, A extends TagsArg>(
  successTags?: ProvidingTags<R, A>
): TagsGetter<R, A> {
  return (result, error, arg) => {
    if (error) return [];

    return getTags(result, error, arg)(successTags);
  };
}
