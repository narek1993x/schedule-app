import config from "../../config/config.json";

export async function removeTokenFromServer(userId) {
  try {
    const response = await fetch(`${config.host}/remove-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId })
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
