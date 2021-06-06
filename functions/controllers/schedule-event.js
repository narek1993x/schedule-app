const rootRef = require("../firebase-admin").rootRef;

async function getScheduleList() {
  try {
    const eventsRef = rootRef.child("scheduleEvents");

    const fbVal = await eventsRef.once("value");
    const scheduleEvents = fbVal.val();

    const resultScheduleEvents = [];
    for (let key in scheduleEvents) {
      const item = scheduleEvents[key];

      for (let itemKey in item) {
        resultScheduleEvents.push({
          ...item[itemKey],
          id: itemKey,
        });
      }
    }

    return resultScheduleEvents;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getScheduleList,
};
