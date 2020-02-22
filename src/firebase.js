import firebase from "firebase/app";
import "firebase/database";
import config from "../config/config.json";

export const firebaseApp = firebase.initializeApp(config);
const rootRef = firebase.database().ref();
export const todosRef = rootRef.child("todos");
export const scheduleEventsRef = rootRef.child("scheduleEvents");
