export const isApiError = (
  error: unknown
): error is { data: Record<"message", string> } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    !!error.data &&
    "message" in error.data &&
    typeof error.data.message === "string"
  );
};
