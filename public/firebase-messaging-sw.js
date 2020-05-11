importScripts("https://www.gstatic.com/firebasejs/4.13.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/4.13.0/firebase-messaging.js"
);

const config = {
  apiKey: "AIzaSyDdb5EAs-zlrRpzurAJbCs3rTY1WQJC3q0",
  authDomain: "vuejs-todo-list-297d2.firebaseapp.com",
  databaseURL: "https://vuejs-todo-list-297d2.firebaseio.com",
  projectId: "vuejs-todo-list-297d2",
  storageBucket: "vuejs-todo-list-297d2.appspot.com",
  messagingSenderId: "1066181790613",
  appId: "1:1066181790613:web:8a3c9af00a81d1472fc49c"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  console.info("notification: ", payload);

  const title = payload.data.name;
  const options = {
    body: payload.data.content
  };

  return self.registration.showNotification(title, options);
});