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

export const handleScheduleEventTime = date => {
  if (date && date.length > 10) {
    return date.slice(10);
  }

  return date;
};

export const setScheduleEventProps = event => {
  return {
    ...event,
    color: colors[rnd(0, colors.length - 1)],
    ...(event.permanent
      ? {
          start: `${moment()
            .day(capitalize(event.week))
            .format("YYYY-M-DD")} ${handleScheduleEventTime(event.start)}`,
          end: `${moment()
            .day(capitalize(event.week))
            .format("YYYY-M-DD")} ${handleScheduleEventTime(event.end)}`
        }
      : {
          start: `${moment(event.date).format(
            "YYYY-M-DD"
          )} ${handleScheduleEventTime(event.start)}`,
          end: `${moment(event.date).format(
            "YYYY-M-DD"
          )} ${handleScheduleEventTime(event.end)}`
        })
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
