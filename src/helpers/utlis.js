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

export const handleEventTime = date => {
  if (date && date.length > 10) {
    return date.slice(10);
  }

  return date;
};

export const setEventProps = event => {
  return {
    ...event,
    color: colors[rnd(0, colors.length - 1)],
    ...(event.week
      ? {
          start: `${moment()
            .day(capitalize(event.week))
            .format("YYYY-M-DD")} ${handleEventTime(event.start)}`,
          end: `${moment()
            .day(capitalize(event.week))
            .format("YYYY-M-DD")} ${handleEventTime(event.end)}`
        }
      : {})
  };
};

export const isMobile = () => {
  return !!(
    window.navigator.userAgent.match(/Android/i) ||
    window.navigator.userAgent.match(/webOS/i) ||
    window.navigator.userAgent.match(/iPhone/i) ||
    window.navigator.userAgent.match(/iPad/i) ||
    window.navigator.userAgent.match(/iPod/i) ||
    window.navigator.userAgent.match(/BlackBerry/i) ||
    window.navigator.userAgent.match(/Windows Phone/i) ||
    window.innerWidth <= 767
  );
};
