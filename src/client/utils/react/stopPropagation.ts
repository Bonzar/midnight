import type { SyntheticEvent } from "react";

export function stopPropagation<E extends SyntheticEvent | Event>(
  eventCallback: (event: E) => void
) {
  return (event: E) => {
    event.stopPropagation();
    eventCallback(event);
  };
}
