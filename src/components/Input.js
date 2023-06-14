import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { Timestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function Input() {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  // To show the time message send in hours
  const firebaseTimestamp = Timestamp.now(); // Replace this with your actual Firebase timestamp

  const firebaseDate = firebaseTimestamp.toDate();
  const timeString = firebaseDate.toLocaleTimeString([], {
    timeStyle: "short",
  });
  // console.log(timeString); // Output: HH:MM AM/PM

  // To show the time message send in hours

  const handleSend = async (e) => {
    e.preventDefault();

    // Handle image upload
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                textTime: timeString,
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          textTime: timeString,
        }),
      });
    }

    // Update user chats with last message and date
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage.text"]: text,
      [data.chatId + ".userInfo"]: {
        displayName: data.user.displayName,
        photoURL: data.user.photoURL,
        uid: data.user.uid,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage.text"]: text,
      [data.chatId + ".userInfo"]: {
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setText("");
    setImg(null);
  };
  // console.log(data.chatId);
  // console.log(text);
  return (
    <form className="form" onSubmit={handleSend}>
      <div className="input">
        <input
          type="text"
          placeholder="Massage..."
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="send">
          <input
            style={{ display: "none" }}
            type="file"
            id="img"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <label htmlFor="img">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "white" }}
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-images"
              viewBox="0 0 16 16"
            >
              <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
              <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
            </svg>
          </label>
          <button type="submit">Send</button>
        </div>
      </div>
    </form>
  );
}

export default Input;
