import React, { useEffect, useState } from "react";
import Message from "../components/Message";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { onSnapshot } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebase";

function Messages() {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  if (!messages) {
    return <div />;
  }

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
    </div>
  );
}

export default Messages;