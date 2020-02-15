export const colors = [
  "blue",
  "indigo",
  "deep-purple",
  "cyan",
  "green",
  "orange",
  "grey darken-1"
];

export const rnd = (a, b) => {
  return Math.floor((b - a + 1) * Math.random()) + a;
};

export const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
