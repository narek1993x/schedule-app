import { firebaseApp, apps } from "./firebase";
import { FirebaseDeviceToken, UserToken } from "./storage";
import vapid from "../config/vapid.json";

const pushServiceHost = "https://push-service-vuejs-todo.web.app";

function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    return firebaseApp.messaging().useServiceWorker(registration);
  } catch (e) {
    throw new Error(e);
  }
}

async function sendTokenToServer(subscription) {
  try {
    const response = await fetch(`${pushServiceHost}/save-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(subscription)
    });
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function initializePushNotificationsService() {
  try {
    const userToken = UserToken.get();

    if (!isPushNotificationSupported() || !userToken) return;

    const messaging = firebaseApp.messaging();
    await messaging.requestPermission();
    messaging.usePublicVapidKey(vapid.vapidPublicKey);

    if (!apps.length) {
      await registerServiceWorker();
    }

    let firebaseToken = FirebaseDeviceToken.get();

    if (!firebaseToken) {
      firebaseToken = await messaging.getToken();
      const response = await sendTokenToServer({
        userId: userToken.id,
        token: firebaseToken
      });
      FirebaseDeviceToken.set(firebaseToken);
      console.info("sendTokenToServer: ", response);
    }

    console.info("push notification token: ", firebaseToken);

    messaging.onMessage(function(payload) {
      console.info("Message received. ", JSON.stringify(payload));
    });

    messaging.onTokenRefresh(async () => {
      try {
        const refreshedToken = await messaging.getToken();
        const response = await sendTokenToServer({
          userId: userToken.id,
          token: refreshedToken,
          refresh: true
        });
        FirebaseDeviceToken.set(firebaseToken);
        console.info("Token refreshed: ", response);
      } catch (err) {
        console.info("Unable to retrieve refreshed token ", err);
      }
    });
  } catch (e) {
    throw new Error(e);
  }
}
