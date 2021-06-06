import { firebaseApp, apps } from "./libs/db";
import { FirebaseDeviceToken, User } from "./storage";
import { getDeviceInfo } from "./helpers/utils";
import { sendTokenToServer } from "./services/api-requests";

function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    return firebaseApp.messaging().useServiceWorker(registration);
  } catch (e) {
    throw new Error(e);
  }
}

export async function initializePushNotificationsService() {
  try {
    const user = User.get();
    let firebaseToken = FirebaseDeviceToken.get();

    if (!isPushNotificationSupported() || !user) return;

    const messaging = firebaseApp.messaging();

    if (!apps.length) {
      await registerServiceWorker();
    }

    if (!firebaseToken) {
      await messaging.requestPermission();
      messaging.usePublicVapidKey(process.env.VUE_APP_FIREBASE_VAPID_PUBLIC_KEY);

      firebaseToken = await messaging.getToken();
      const response = await sendTokenToServer({
        userId: user.uid,
        token: firebaseToken,
        deviceInfo: getDeviceInfo(),
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
          userId: user.uid,
          token: refreshedToken,
          deviceInfo: getDeviceInfo(),
          refresh: true,
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
