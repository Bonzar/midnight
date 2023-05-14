import type { SyntheticEvent } from "react";

export function preventDefault<E extends SyntheticEvent | Event>(
  eventCallback: (event: E) => void
) {
  return (event: E) => {
    event.preventDefault();
    eventCallback(event);
  };
}
