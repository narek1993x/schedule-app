import firebase from "./firebase";

export const apps = firebase.apps;
export const firebaseApp = firebase.app("[DEFAULT]");

const rootRef = firebase.database().ref();
export const todosRef = rootRef.child("todos");
const eventsRef = rootRef.child("scheduleEvents");

const firestore = firebase.firestore();

export function createUser(uid, data) {
  return firestore
    .collection("users")
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
}

export async function getUserEvents(uid) {
  try {
    const fbVal = await eventsRef.child(uid).once("value");
    const events = fbVal.val();

    const resultEvents = [];

    for (let key in events) {
      resultEvents.push({
        ...events[key],
        id: key,
      });
    }

    return resultEvents;
  } catch (error) {
    throw error;
  }
}

export async function addUserEvents(uid, events) {
  try {
    const newEvents = await Promise.all(events.map((event) => eventsRef.child(uid).push(event)));

    const resultEvents = [];

    events.forEach((event, index) => {
      resultEvents.push({
        ...event,
        id: newEvents[index].key,
      });
    });

    return resultEvents;
  } catch (error) {
    throw error;
  }
}

export async function updateUserEvents(uid, events) {
  try {
    await Promise.all(
      events.map((event) =>
        eventsRef
          .child(uid)
          .child(event.id)
          .update(event),
      ),
    );
  } catch (error) {
    throw error;
  }
}

export async function removeUserEvent(uid, eventId) {
  try {
    await eventsRef
      .child(uid)
      .child(eventId)
      .remove();
  } catch (error) {
    throw error;
  }
}
