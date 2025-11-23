import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// You can use service account JSON OR GOOGLE_APPLICATION_CREDENTIALS env.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

export const firestore = admin.firestore();
