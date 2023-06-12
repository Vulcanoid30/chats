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
  return (
    <form className="form" onSubmit={handleSend}>
      <div className="input">
        <input
          type="text"
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="send">
          <input
            type="file"
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <label htmlFor="file"></label>
          <button type="submit">Send</button>
        </div>
      </div>
    </form>
  );
}

export default Input;
