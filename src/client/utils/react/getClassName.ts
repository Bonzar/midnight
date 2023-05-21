export const getClassName = (
  classList: (string | null | undefined | false)[]
) => {
  return classList.filter(Boolean).join(" ");
};
