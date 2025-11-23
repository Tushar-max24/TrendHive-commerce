import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const sendNotification = async (userId, message, type = "system") => {
  await addDoc(collection(db, "notifications"), {
    userId,
    message,
    type,
    read: false,
    createdAt: Timestamp.now(),
  });
};
