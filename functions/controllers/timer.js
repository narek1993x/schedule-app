const CronJob = require("cron").CronJob;
const moment = require("moment");
const scheduleEvent = require("./schedule-event");
const subscription = require("./subscription");
const messaging = require("./messaging");

moment.tz.setDefault("Asia/Yerevan");

function filterByTime(time, week) {
  const [hours, minutes] = time.split(":");
  const year = moment().format("YYYY");
  const month = moment().format("M");

  let day = 0;
  if (typeof week !== "undefined") {
    day = moment()
      .day(capitalize(week))
      .format("D");
  } else {
    day = moment().format("D");
  }

  const sec = moment().format("s");

  return parseInt(
    moment(new Date(year, month, day, hours, minutes, sec)).valueOf() / 1000,
    10
  );
}

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

async function handleNotificationsTimer() {
  const subscriptions = await subscription.getSubscriptions();
  const schedules = await scheduleEvent.getScheduleList();

  const currentTime = filterByTime(moment().format("HH:mm"));

  const filteredSchedules = schedules
    .filter(schedule => {
      const startTime = filterByTime(schedule.start, schedule.week);
      const timeLeft = startTime - currentTime;
      return (
        !!schedule.reminder &&
        subscriptions.some(
          subscription => subscription.userId === schedule.ownerId
        ) &&
        timeLeft <= 300 &&
        timeLeft > 0
      );
    })
    .sort(
      (a, b) => filterByTime(a.start, a.week) - filterByTime(b.start, b.week)
    );

  const notificationMessages = messaging.createMessages(
    filteredSchedules,
    subscriptions
  );

  if (notificationMessages && notificationMessages.length) {
    notificationMessages.forEach(message => {
      messaging.sendNotification(message);
    });
  }
}

const notificationJob = new CronJob(
  "0 */5 * * * *",
  () => {
    handleNotificationsTimer();
  },
  null,
  false,
  "Asia/Yerevan"
);

module.exports = {
  notificationJob
};
