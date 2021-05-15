const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
    databaseURL: "https://vuejs-todo-list-297d2.firebaseio.com",
  });
}

// As an admin, the app has access to read and write all data, regardless of Security Rules
const rootRef = admin.database().ref();

module.exports = {
  rootRef,
  admin,
};
