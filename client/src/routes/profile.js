import React from "react";
import Header from "../components/Header";
import ProfileBody from "../components/ProfileBody";
import Sidebar from "../components/Sidebar";

function Profile() {
  return (
    <div className="App">
      <Sidebar />
      <div className="HeaderAndFeed">
        <Header />
        <ProfileBody />
      </div>
    </div>
  );
}

export default Profile;
