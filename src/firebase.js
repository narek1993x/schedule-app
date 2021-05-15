import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/firebase-messaging";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    databaseURL: process.env.VUE_APP_FIREBASE_DB_URL,
  });
}

export const apps = firebase.apps;
export const firebaseApp = firebase.app("[DEFAULT]");

const rootRef = firebase.database().ref();
export const todosRef = rootRef.child("todos");
export const scheduleEventsRef = rootRef.child("scheduleEvents");

export default firebase;
