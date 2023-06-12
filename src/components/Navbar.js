import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
// import A from "../img/A.jpg";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">zLhYd Chat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="gambar"></img>
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Log Out</button>
      </div>
    </div>
  );
}

export default Navbar;
