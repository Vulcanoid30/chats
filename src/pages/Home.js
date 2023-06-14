import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
// import Background from "../img/Background.jpg";

function Home() {
  return (
    <div className="home">
      <div className="container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default Home;
