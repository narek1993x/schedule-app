import moment from "moment";

const colors = ["blue", "indigo", "deep-purple", "cyan", "green", "orange", "grey darken-1"];

const rnd = (a, b) => {
  return Math.floor((b - a + 1) * Math.random()) + a;
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const nth = (d) => {
  return d > 3 && d < 21 ? "th" : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
};

export const handleScheduleEventTime = (date) => {
  if (date && date.length > 10) {
    return date.slice(10).trim();
  }

  return date;
};

export const getWeekDayFromDate = (date) => {
  const newDate = moment(date).format("dddd");
  return typeof newDate === "string" ? newDate.toLowerCase() : newDate;
};

export const setScheduleEventProps = (event, { start, end }) => {
  return {
    ...event,
    color: colors[rnd(0, colors.length - 1)],
    ...(event.permanent
      ? {
          start: `${moment(event.week === "sunday" ? end : start)
            .day(capitalize(event.week))
            .format("YYYY-M-DD")} ${handleScheduleEventTime(event.start)}`,
          end: `${moment(event.week === "sunday" ? end : start)
            .day(capitalize(event.week))
            .format("YYYY-M-DD")} ${handleScheduleEventTime(event.end)}`,
        }
      : {
          start: `${moment(event.date).format("YYYY-M-DD")} ${handleScheduleEventTime(event.start)}`,
          end: `${moment(event.date).format("YYYY-M-DD")} ${handleScheduleEventTime(event.end)}`,
        }),
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

export function getDeviceInfo() {
  "use strict";

  const module = {
    options: [],
    header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
    dataos: [
      { name: "Windows Phone", value: "Windows Phone", version: "OS" },
      { name: "Windows", value: "Win", version: "NT" },
      { name: "iPhone", value: "iPhone", version: "OS" },
      { name: "iPad", value: "iPad", version: "OS" },
      { name: "Kindle", value: "Silk", version: "Silk" },
      { name: "Android", value: "Android", version: "Android" },
      { name: "PlayBook", value: "PlayBook", version: "OS" },
      { name: "BlackBerry", value: "BlackBerry", version: "/" },
      { name: "Macintosh", value: "Mac", version: "OS X" },
      { name: "Linux", value: "Linux", version: "rv" },
      { name: "Palm", value: "Palm", version: "PalmOS" },
    ],
    databrowser: [
      { name: "Chrome", value: "Chrome", version: "Chrome" },
      { name: "Firefox", value: "Firefox", version: "Firefox" },
      { name: "Safari", value: "Safari", version: "Version" },
      { name: "Internet Explorer", value: "MSIE", version: "MSIE" },
      { name: "Opera", value: "Opera", version: "Opera" },
      { name: "BlackBerry", value: "CLDC", version: "CLDC" },
      { name: "Mozilla", value: "Mozilla", version: "Mozilla" },
    ],
    init: function() {
      const agent = this.header.join(" "),
        os = this.matchItem(agent, this.dataos),
        browser = this.matchItem(agent, this.databrowser);

      return { os: os, browser: browser };
    },
    matchItem: function(string, data) {
      let i = 0,
        j = 0,
        regex,
        regexv,
        match,
        matches,
        version;

      for (i = 0; i < data.length; i += 1) {
        regex = new RegExp(data[i].value, "i");
        match = regex.test(string);
        if (match) {
          regexv = new RegExp(data[i].version + "[- /:;]([\\d._]+)", "i");
          matches = string.match(regexv);
          version = "";
          if (matches) {
            if (matches[1]) {
              matches = matches[1];
            }
          }
          if (matches) {
            matches = matches.split(/[._]+/);
            for (j = 0; j < matches.length; j += 1) {
              if (j === 0) {
                version += matches[j] + ".";
              } else {
                version += matches[j];
              }
            }
          } else {
            version = "0";
          }
          return {
            name: data[i].name,
            version: parseFloat(version),
          };
        }
      }
      return { name: "unknown", version: 0 };
    },
  };

  return module.init();
}
