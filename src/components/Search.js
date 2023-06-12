import React, { useContext, useState } from "react";
// import A from "../img/A.jpg";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

function Search() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    const otherUser = user;
    const combinedId =
      currentUser.uid > otherUser.uid
        ? currentUser.uid + otherUser.uid
        : otherUser.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      // If chat exists, do nothing
      if (!res.exists()) {
        // create new chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // update user chats collection for current user
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: otherUser.uid,
            displayName: otherUser.displayName,
            photoURL: otherUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        // update user chats collection for other user
        await updateDoc(doc(db, "userChats", otherUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchFrom">
        <input
          placeholder="find a user"
          value={username}
          type="text"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {user && (
        <div className="userChat" onClick={() => handleSelect(user.uid)}>
          <img src={user.photoURL} alt={user.displayName} />
          <div className="userChatinfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
