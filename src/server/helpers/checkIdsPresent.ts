export function checkIdsPresent(
  data: { whoseIdentifier: string; value: unknown }[],
  messageAction: string
) {
  if (data.some((id) => typeof id.value === "undefined")) {
    throw new Error(
      `Для ${messageAction} не был предоставлен ID: ${data
        .map((id) => typeof id.value === "undefined" && id.whoseIdentifier)
        .filter(Boolean)
        .join(", ")}`
    );
  }
}
