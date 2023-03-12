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
    axios
      .post(`http://localhost:5000/avatar/${activeUser}`, {
        avatar: `Avatar-${e.target.id}.png`,
      })
      .then((response) => {
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
          <Popup
            position="center"
            modal
            trigger={<button className="tweetBtn">Choose avatar</button>}
          >
            {(close) => (
              <div className="choose-avatar-container">
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="1"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-1.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="2"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-2.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="3"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-3.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="4"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-4.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="5"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-5.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="6"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-6.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="7"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-7.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="8"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-8.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="9"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-9.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="10"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-10.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="11"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-11.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="12"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-12.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="13"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-13.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="14"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-14.png`}
                ></img>
                <img
                  onClick={(e) => {
                    close();
                    handleSubmitAvatar(e);
                  }}
                  id="15"
                  className="choose-profile-avatar"
                  src={`http://localhost:5000/images/Avatar-15.png`}
                ></img>
              </div>
            )}
          </Popup>
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
