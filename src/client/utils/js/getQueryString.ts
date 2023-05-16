export const getQueryString = (obj: Record<string, unknown>): string => {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
};
