import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { AiFillCamera } from "react-icons/ai";
import Tweet from "./Tweet";
import jwtDecode from "jwt-decode";
import axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function ProfileBody() {
  const [loading, setLoading] = useState(true);
  const [tweets, setTweets] = useState([]);
  const [activeUser, setActiveUser] = useState("");
  const [followers, setFollowers] = useState("");
  const [followBtn, setFollowBtn] = useState("");
  const [avatar, setAvatar] = useState("initial-avatar.png");
  const [isImageSelected, setIsImageSelected] = useState(false);
  const navigate = useNavigate();
  let { userName } = useParams();
  const isActiveUser = activeUser === userName;
  const [img, setImg] = useState();

  const onImageChange = (e) => {
    const [file] = e.target.files;
    setImg(URL.createObjectURL(file));
    setIsImageSelected(true);
  };

  const handleFollow = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/user/${activeUser}/follow/${userName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setFollowers(data.followers);
        setFollowBtn(data.followBtn);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async function populateUserData() {
    const req = await fetch(`http://localhost:5000/profile/${userName}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    if (data.status === "ok") {
      setLoading(false);
      setActiveUser(data.activeUser);
      setTweets(data.tweets);
      setFollowers(data.followers);
      setFollowBtn(data.followBtn);
      setAvatar(data.avatar);
    } else {
      alert(data.error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwtDecode(token);
      if (!user) {
        localStorage.removeItem("token");
      } else {
        populateUserData();
      }
    } else navigate("/");
  }, []);

  const handleSubmitAvatar = (e) => {
    e.preventDefault();
    let form = document.getElementById("form");
    let formData = new FormData(form);
    const action = e.target.action;

    axios.post(`${action}`, formData).then((response) => {
      response.data.status === "ok" && setAvatar(response.data.avatar);
    });
  };

  return (
    <div className="container">
      <div className="flex-avatar">
        <img
          className="profile-avatar"
          src={`http://localhost:5000/images/${avatar}`}
        ></img>
        {isActiveUser && (
          <form
            className="avatar-form"
            onSubmit={handleSubmitAvatar}
            action={`http://localhost:5000/avatar/${activeUser}`}
            encType="multipart/form-data"
            id="form"
          >
            <label className="avatar-label">
              <AiFillCamera />
              <input
                className="avatar-input"
                id="avatarInputId"
                type="file"
                accept=".png, .jpg, .jpeg"
                name="photo"
                onChange={onImageChange}
                required
              />
              Upload profile picture
            </label>
            <Popup
              trigger={<img className="avatar-preview" src={img} alt="" />}
              modal
              position="center"
            >
              <div className="popup-avatar">
                <h1>Preview</h1>
                <img
                  style={{ width: "200px", margin: "20px auto" }}
                  src={img}
                  alt=""
                />
              </div>
            </Popup>
            {isImageSelected && (
              <button className="tweetBtn avatarBtn" type="submit">
                Confirm
              </button>
            )}
          </form>
        )}
      </div>
      <div className="userName">{userName}</div>

      <div className="followFollowing">
        <div>
          <b>{followers}</b> Followers
        </div>
        <div>{/* <b>{user.following.length}</b> Following */}</div>
      </div>
      {!isActiveUser && (
        <div className="followBtn-div">
          <form
            action={`http://localhost:5000/user/${activeUser}/follow/${userName}`}
            method="POST"
            className="follow-form"
            onSubmit={handleFollow}
          >
            <button className="followBtn" type="submit">
              {followBtn}
            </button>
          </form>
        </div>
      )}
      <div className="userTweets">
        <div className="userTweets-heading">Tweets</div>
        <div className="tweets">
          <ul className="tweet-list">
            {loading ? (
              <div
                style={{ marginTop: "50px", marginLeft: "250px" }}
                className="loadingio-spinner-rolling-uzhdebhewyj"
              >
                <div className="ldio-gkgg43sozzi">
                  <div></div>
                </div>
              </div>
            ) : (
              tweets.map(function (tweet) {
                return <Tweet user={activeUser} body={tweet} />;
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfileBody;
