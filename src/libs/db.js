import firebase from "./firebase";

export const apps = firebase.apps;
export const firebaseApp = firebase.app("[DEFAULT]");

const rootRef = firebase.database().ref();
export const todosRef = rootRef.child("todos");
export const scheduleEventsRef = rootRef.child("scheduleEvents");

const firestore = firebase.firestore();

export function createUser(uid, data) {
  return firestore
    .collection("users")
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
}
