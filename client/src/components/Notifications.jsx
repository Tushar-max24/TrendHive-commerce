import { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";

export default function Notifications() {
  const { currentUser } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [currentUser]);


  const markAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) {
        updateDoc(doc(db, "notifications", n.id), { read: true });
      }
    });
  };


  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative text-xl hover:text-yellow-400 transition">
        🔔
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute bg-white shadow-lg rounded-lg w-72 right-0 mt-3 p-3 z-50 text-black">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Notifications</h3>
            <button className="text-sm text-blue-600" onClick={markAllRead}>
              Mark all read
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`p-2 border-b text-sm ${!n.read ? "bg-yellow-50" : ""}`}>
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
