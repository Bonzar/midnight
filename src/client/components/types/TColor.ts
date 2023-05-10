export type TColor =
  | "white"
  | "grey97"
  | "grey92"
  | "grey85"
  | "grey76"
  | "grey65"
  | "grey52"
  | "grey37"
  | "black"
  | "tunicGreen"
  | "tunicGreen-light"
  | "overgrown"
  | "overgrown-light"
  | "beer"
  | "beer-light"
  | "embarrassed"
  | "embarrassed-light"
  | "venusSlipperOrchid"
  | "venusSlipperOrchid-light"
  | "yellowMellow"
  | "yellowMellow-light"
  | "peachFury"
  | "peachFury-light"
  | "illicitPink"
  | "illicitPink-light"
  | "legendaryLavender"
  | "legendaryLavender-light";

export type TLightColor<Colors = TColor> = Colors extends `${infer R}-light`
  ? Colors
  : never;

export type TActiveColor<Colors = TLightColor> =
  Colors extends `${infer R}-light` ? R : never;
