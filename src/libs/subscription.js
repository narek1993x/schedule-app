import { getDeviceInfo } from "../helpers/utils";

export async function removeTokenFromServer(userId) {
  try {
    const response = await fetch(`${process.env.VUE_APP_FIREBASE_VAPID_HOST}/remove-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, deviceInfo: getDeviceInfo() }),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function sendTokenToServer(subscription) {
  try {
    const response = await fetch(`${process.env.VUE_APP_FIREBASE_VAPID_HOST}/save-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
}
