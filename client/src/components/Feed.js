import React, { useState, useEffect } from "react";
import Tweet from "./Tweet";
import { useNavigate } from "react-router-dom";
import { AiFillCamera } from "react-icons/ai";
import axios from "axios";
import jwtDecode from "jwt-decode";
import moment from "moment";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function Feed() {
  const [input, setInput] = useState("");
  // const [imageInput, setImageInput] = useState();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const navigate = useNavigate();
  const [img, setImg] = useState("");
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [tweetCount, setTweetCount] = useState("20");

  const checkInput = input || img;

  async function populateTweets() {
    const req = await fetch("http://localhost:5000/feed", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    if (data.status === "ok") {
      setTweets(data.tweets);
      setActiveUser(data.activeUser.username);
      setUserAvatar(data.activeUser.avatar);
      setLoading(false);
    } else {
      alert(data.error);
      navigate("/");
    }
  }

  async function addTweets(e) {
    e.preventDefault();
    const req = await fetch(`http://localhost:5000/feed?t=${tweetCount}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    if (data.status === "ok") {
      setTweets((prevTweets) => {
        return [...prevTweets, ...data.tweets];
      });
      setTweetCount((prevValue) => {
        return parseInt(prevValue) + 20;
      });
    } else {
      alert(data.error);
      navigate("/");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      if (!user) {
        localStorage.removeItem("token");
      } else {
        populateTweets();
      }
    } else navigate("/");
  }, [loading]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const tweet = {
      content: input,
      postedBy: {
        username: activeUser,
      },
      image: "",
      likes: [],
      retweets: [],
      comments: [],
      likeTweetBtn: "black",
      postedTweetTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
      tweetId: moment(),
    };

    // let form = document.getElementById("form");
    // let formData = new FormData(form);

    // formData.append("main", JSON.stringify(tweet));
    // console.log(formData);
    const data = { tweet: JSON.stringify(tweet), image: img };
    const action = e.target.action;

    axios
      .post(`${action}`, data)
      .then(setInput(""))
      .then(setImg(""))
      .then(setIsImageSelected(false))
      .then(console.log((e.target[1].value = "")))
      .then(
        setTweets((prevTweets) => {
          return [tweet, ...prevTweets];
        })
      )
      .then(setLoading(true))
      .then(
        setTimeout(() => {
          setLoading(false);
        }, 300)
      )
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="form-flex">
        <img
          className="tweet-avatar"
          style={{ marginBottom: "0" }}
          src={`http://localhost:5000/images/${userAvatar}`}
        ></img>

        <form
          onSubmit={handleSubmit}
          method="post"
          encType="multipart/form-data"
          action="http://localhost:5000/feed"
          className="tweet-form"
          id="form"
        >
          <input
            autoFocus
            placeholder="What's happening?"
            type="text"
            value={input}
            onChange={handleChange}
          ></input>
          <div className="tweet-flex">
            <div>
              <AiFillCamera
                style={{
                  color: "#1DA1F2",
                  fontSize: "1.5rem",
                }}
              />
            </div>

            <input
              className="image-input"
              type="text"
              placeholder="Enter an image url here"
              value={img}
              onChange={(e) => setImg(e.target.value)}
            ></input>

            <button
              className={checkInput ? "tweetBtn" : "disabled"}
              disabled={!checkInput}
              type="submit"
            >
              {" "}
              Tweet
            </button>
          </div>
          <img className="tweet-preview" src={img} alt="" />
        </form>
      </div>

      <div className="tweets">
        <ul className="tweet-list">
          {loading ? (
            <div
              style={{ marginTop: "50px", marginLeft: "250px" }}
              class="loadingio-spinner-rolling-uzhdebhewyj"
            >
              <div class="ldio-gkgg43sozzi">
                <div></div>
              </div>
            </div>
          ) : (
            tweets.map(function (tweet) {
              return (
                <>
                  <Tweet
                    updateLoading={setLoading}
                    user={activeUser}
                    body={tweet}
                  />
                </>
              );
            })
          )}
        </ul>
      </div>
      <form className="showMore-form" onSubmit={addTweets}>
        <button className="showMore" type="submit">
          Show more tweets
        </button>
      </form>
    </div>
  );
}

export default Feed;
