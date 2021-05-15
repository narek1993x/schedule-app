require("dotenv").config();
const fs = require("fs");
const path = require("path");

try {
  fs.writeFileSync(
    path.resolve(__dirname, "../dist/swenv.js"),
    `const process = {
      env: {
        VUE_APP_FIREBASE_API_KEY: "${process.env.VUE_APP_FIREBASE_API_KEY}",
        VUE_APP_FIREBASE_AUTH_DOMAIN: "${process.env.VUE_APP_FIREBASE_AUTH_DOMAIN}",
        VUE_APP_FIREBASE_PROJECT_ID: "${process.env.VUE_APP_FIREBASE_PROJECT_ID}",
        VUE_APP_FIREBASE_DB_URL: "${process.env.VUE_APP_FIREBASE_DB_URL}",
        VUE_APP_FIREBASE_STORAGE_BUCKET: "${process.env.VUE_APP_FIREBASE_STORAGE_BUCKET}",
        VUE_APP_FIREBASE_MESSAGE_SENDER_ID: "${process.env.VUE_APP_FIREBASE_MESSAGE_SENDER_ID}",
        VUE_APP_FIREBASE_APP_ID: "${process.env.VUE_APP_FIREBASE_APP_ID}",
      }
  }`,
  );
  console.log("swenv.js file generated successfully");
} catch (error) {
  console.log("Error while generating swenv.js", err.message);
  process.exit(1);
}
