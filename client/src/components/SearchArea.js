import React, { useState } from "react";
import Usercard from "./Usercard";
const axios = require("axios");

function SearchArea() {
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const req = await fetch(`${e.target.action}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    if (data.status === "ok") {
      setUsers(data.users);
    } else console.log(data.error);
  };

  return (
    <div className="HeaderAndFeed">
      <form
        className="search-form"
        onSubmit={handleSubmit}
        method="GET"
        action={`http://localhost:5000/search/${text}`}
      >
        <input
          autoFocus
          placeholder="Search users..."
          value={text}
          onChange={handleChange}
        ></input>
        <button type="submit" className="tweetBtn">
          Search
        </button>
      </form>
      <div className="allUsers">
        {users.length === 0 ? (
          <h1 className="noUserFound">No user found </h1>
        ) : (
          users.map((user) => {
            return (
              <Usercard
                avatar={user.avatar}
                username={user.username}
                followers={user.followers}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default SearchArea;
