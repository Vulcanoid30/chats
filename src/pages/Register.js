import React, { useState } from "react";
import { auth } from "../firebase";
import { storage } from "../firebase";
import { db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [err, catchError] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const file = e.target.file.files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // console.log(res);
      const storageRef = ref(storage, displayName);
      const metadata = {
        contentType: file.type,
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        (err) => {
          // console.log("file dont upload");
          catchError(true);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/chats");
          });
        }
      );
    } catch (err) {
      // console.log("failed to upload db");
      catchError(true);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">zLhYd Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="display name" />
          <input type="email" name="email" placeholder="email" />
          <input type="password" name="password" placeholder="password" />
          <input
            style={{ display: "none" }}
            name="file"
            type="file"
            id="file"
            accept="image/*"
          />
          <label htmlFor="file">ihjodhiah</label>
          <button type="submit">Sign Up</button>
          {err && <span>Some Thing Went Wrong</span>}
        </form>
        <p>
          Have a account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
