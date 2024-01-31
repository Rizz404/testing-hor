import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY,
    clientEmail: process.env.CLIENT_EMAIL,
  }),
  storageBucket: "gs://happiness-overload.appspot.com",
});

export const bucket = admin.storage().bucket();
