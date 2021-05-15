import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/firebase-messaging";
import config from "../config/firebase.json";

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const apps = firebase.apps;
export const firebaseApp = firebase.app("[DEFAULT]");

const rootRef = firebase.database().ref();
export const todosRef = rootRef.child("todos");
export const scheduleEventsRef = rootRef.child("scheduleEvents");

export default firebase;
