import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../happiness-overload-firebase-adminsdk-c7rx1-0aa9bc76b6.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: "gs://happiness-overload.appspot.com",
});

export const bucket = admin.storage().bucket();
