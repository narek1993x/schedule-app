import config from "../../config/config.json";
import { getDeviceInfo } from "../helpers/utils";

export async function removeTokenFromServer(token) {
  try {
    const response = await fetch(`${config.host}/remove-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId: token.id, deviceInfo: getDeviceInfo() })
    });
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function sendTokenToServer(subscription) {
  try {
    const response = await fetch(`${config.host}/save-subscription`, {
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
