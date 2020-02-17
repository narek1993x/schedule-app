import moment from "moment";

const colors = [
  "blue",
  "indigo",
  "deep-purple",
  "cyan",
  "green",
  "orange",
  "grey darken-1"
];

const rnd = (a, b) => {
  return Math.floor((b - a + 1) * Math.random()) + a;
};

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const setEventProps = event => {
  return {
    ...event,
    color: colors[rnd(0, colors.length - 1)],
    ...(event.week
      ? {
          start: `${moment()
            .day(capitalize(event.week))
            .format("YYYY-M-DD")} ${event.start}`,
          end: `${moment()
            .day(capitalize(event.week))
            .format("YYYY-M-DD")} ${event.end}`
        }
      : {})
  };
};
