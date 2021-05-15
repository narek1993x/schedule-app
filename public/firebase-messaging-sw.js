importScripts("swenv.js");
importScripts("https://www.gstatic.com/firebasejs/7.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.8.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  databaseURL: process.env.VUE_APP_FIREBASE_DB_URL,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  console.info("notification: ", payload);

  const title = payload.data.name;
  const options = {
    body: payload.data.content,
    icon: "./img/icons/android-chrome-512x512.png",
    badge: "./img/icons/badge.png", // Min 72x72 or larger
    actions: [{ action: "close", title: "Close", icon: "./img/icons/close.png" }],
  };

  return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", function(event) {
  console.info("notificationclick: ", event);
  event.notification.close();
});
