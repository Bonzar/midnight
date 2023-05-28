import type { TagTypes } from "../apiSlice";
import { CacheUtils } from "@bonzar/rtk-query-tags-util";

const cacheUtils = new CacheUtils<TagTypes>();

export const {
  withList,
  withArgAsId,
  withNestedList,
  withNestedArgId,
  withNestedResultId,
  invalidateList,
  invalidateOnSuccess,
  withTags,
} = cacheUtils;
