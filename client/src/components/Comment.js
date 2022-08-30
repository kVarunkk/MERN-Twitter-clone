import React, { useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function Comment(props) {
  const [likeCount, setLikeCount] = useState(props.body.likes.length);
  const [btnColor, setBtnColor] = useState(props.body.likeCommentBtn);
  const [commentContent, setCommentContent] = useState(props.body.content);
  const [isEdited, setIsEdited] = useState(props.body.isEdited);
  const commentId = props.body.postedCommentTime;
  const isUserActive = props.body.postedBy.username === props.user;

  const handleSubmit = (e) => {
    e.preventDefault();

    const action = e.currentTarget.action;

    fetch(`${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(console.log("success"))
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setLikeCount(data.likes);
        setBtnColor(data.btnColor);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteComment = (e) => {
    e.preventDefault();

    const action = e.target.action;

    fetch(`${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          props.updateLoading(true);
        }
      })
      .then(
        setTimeout(() => {
          props.updateLoading(false);
        }, 300)
      )
      .catch((error) => {
        console.log(error);
      });
  };

  const editComment = (e) => {
    e.preventDefault();

    const action = e.target.action;

    fetch(`${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: commentContent,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          props.updateLoading(true);
        }
      })
      .then(
        setTimeout(() => {
          props.updateLoading(false);
        }, 300)
      )
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <li className="comment-items">
      <div className="parent-flex-introduction">
        <img
          className="tweet-avatar"
          src={`http://localhost:5000/images/${props.body.postedBy.avatar}`}
        ></img>
        <Link to={`/profile/${props.body.postedBy.username}`}>
          <div style={{ marginBottom: "5px" }} className="flex-introduction">
            <div className="postedBy">{props.body.postedBy.username}</div>.
            <div className="time">{props.body.postedCommentTime}</div>
            <div>{isEdited ? ". edited" : ""}</div>
          </div>
        </Link>

        {isUserActive && (
          <Popup
            trigger={
              <button className="threeDots">
                {" "}
                <BsThreeDots />
              </button>
            }
            position="right"
            nested
          >
            <ul className="delete-popup" style={{ listStyle: "none" }}>
              <li>
                <form
                  onSubmit={deleteComment}
                  action={`http://localhost:5000/deleteComment/${commentId}`}
                  style={{ marginBottom: "0", color: "#F75D59" }}
                >
                  <button className="delete-btn">
                    <RiDeleteBin6Fill /> Delete
                  </button>
                </form>
              </li>
              <li>
                <Popup
                  trigger={
                    <button className="delete-btn">
                      <AiFillEdit /> Edit
                    </button>
                  }
                  modal
                  position="center"
                >
                  <div className="comment-modal">
                    <form
                      style={{ marginBottom: "10px" }}
                      onSubmit={(e) => {
                        editComment(e);
                      }}
                      action={`http://localhost:5000/editComment/${commentId}`}
                    >
                      <input
                        required
                        autoFocus
                        type="text"
                        value={commentContent}
                        onChange={(e) => {
                          setCommentContent(e.target.value);
                        }}
                      ></input>
                      <br></br>
                      <button className="tweetBtn" type="submit">
                        {" "}
                        Edit
                      </button>
                    </form>
                  </div>
                  ;{/* }} */}
                </Popup>
              </li>
            </ul>
          </Popup>
        )}
      </div>

      <Link to={`/profile/${props.tweetBy}`}>
        <div className="flex-introduction">
          Replying to
          <div className="postedBy" style={{ color: "#1DA1F2" }}>
            @{props.tweetBy}
          </div>
        </div>
      </Link>
      <div className="content">{props.body.content}</div>
      <div className="icons">
        <div style={{ color: btnColor }} className="icon">
          <form
            onSubmit={handleSubmit}
            style={{ marginBottom: "0" }}
            className="likeForm"
            action={`http://localhost:5000/comment/${props.user}/like/${commentId}`}
            method="post"
          >
            <button>
              <AiOutlineLike />
              <div className="like-count">{likeCount}</div>
            </button>
          </form>
        </div>
      </div>
    </li>
  );
}

export default Comment;
