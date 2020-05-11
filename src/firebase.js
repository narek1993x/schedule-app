import firebase from "firebase/app";
import "firebase/database";
import "firebase/firebase-messaging";
import config from "../config/firebase.json";

export const firebaseApp = firebase.initializeApp(config);
export const apps = firebase.apps;
const rootRef = firebase.database().ref();
export const todosRef = rootRef.child("todos");
export const scheduleEventsRef = rootRef.child("scheduleEvents");
