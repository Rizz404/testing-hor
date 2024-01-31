import admin from "firebase-admin";
import serviceAccount from "../happiness-overload-firebase-adminsdk-c7rx1-0aa9bc76b6.json";
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://happiness-overload.appspot.com",
});
export const bucket = admin.storage().bucket();
//# sourceMappingURL=firebaseConfig.js.map