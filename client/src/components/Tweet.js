import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AiOutlineRetweet, AiOutlineLike } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { GoComment } from "react-icons/go";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import moment from "moment";
import { useToast } from "@chakra-ui/toast";

function Tweet(props) {
  const [likeCount, setLikeCount] = useState(props.body.likes.length);
  const [commentCount, setCommentCount] = useState(props.body.comments.length);
  const [retweetCount, setRetweetCount] = useState(props.body.retweets.length);
  const [retweetBtnColor, setRetweetBtnColor] = useState(props.body.retweetBtn);
  const [btnColor, setBtnColor] = useState(props.body.likeTweetBtn);
  const [isRetweeted, setIsRetweeted] = useState(props.body.isRetweeted);
  const [retweetBy, setRetweetBy] = useState(props.body.retweetedByUser);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tweetContent, setTweetContent] = useState(props.body.content);
  const [isEdited, setIsEdited] = useState(props.body.isEdited);
  const tweetId = props.body.postedTweetTime;
  const isUserActive = props.body.postedBy.username === props.user;
  const toast = useToast();
  const errorToast = () => {
    toast({
      title: `An error occured while posting`,
      status: "error",
      position: "top",
      isClosable: true,
    });
  };

  async function populateComments() {
    const req = await fetch(`http://localhost:5000/feed/comments/${tweetId}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    if (data.status === "ok") {
      if (data.tweet.comments !== []) {
        setComments(data.tweet[0].comments);
        setTimeout(() => {
          setLoading(false);
        }, 300);
      } else setComments([]);
    } else {
      alert(data.error);
    }
  }

  useEffect(() => {
    populateComments();
  }, [loading]);

  const handleChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    const action = e.currentTarget.action;

    const comment = {
      content: commentInput,
      postedBy: {
        username: props.user,
      },
      likes: [],
      likeCommentBtn: "black",
      postedCommentTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
      commentId: moment(),
    };

    fetch(`${action}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(comment),
    })
      .then(setCommentInput(""))
      .then((res) => res.json())
      .then((data) => {
        setCommentCount(data.comments);
      })
      // .then(
      //   setComments((prevValue) => {
      //     return [comment, ...prevValue];
      //   })
      // )
      .then(setLoading(true))
      .then(
        setTimeout(() => {
          setLoading(false);
        }, 500)
      )
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRetweetSubmit = (e) => {
    e.preventDefault();

    const action = e.currentTarget.action;

    fetch(`${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then(
        retweetBtnColor === "black" ? handleSetRetweet() : handleSetDisRetweet()
      )
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSetLike = () => {
    setLikeCount(likeCount + 1);
    setBtnColor("deeppink");
  };

  const handleSetDisike = () => {
    setLikeCount(likeCount - 1);
    setBtnColor("black");
  };

  const handleSetRetweet = () => {
    setRetweetCount(retweetCount + 1);
    setRetweetBtnColor("green");
  };

  const handleSetDisRetweet = () => {
    setRetweetCount(retweetCount - 1);
    setRetweetBtnColor("black");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const action = e.currentTarget.action;

    fetch(`${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then(btnColor === "black" ? handleSetLike() : handleSetDisike())
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteTweet = (e) => {
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

  const editTweet = (e) => {
    e.preventDefault();

    const action = e.target.action;

    fetch(`${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: tweetContent,
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
    <>
      {props.body.postedBy ? (
        <div className="post">
          <li className="tweet-items">
            {isRetweeted && (
              <div className="retweetedBy">{retweetBy} Retweeted</div>
            )}
            <div className="parent-flex-introduction">
              <img
                className="tweet-avatar"
                src={`http://localhost:5000/images/${props.body.postedBy.avatar}`}
              ></img>
              <Link to={`/profile/${props.body.postedBy.username}`}>
                <div className="flex-introduction">
                  <div className="postedBy">{props.body.postedBy.username}</div>
                  .<div className="time">{props.body.postedTweetTime}</div>
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
                  position="right "
                  nested
                >
                  {(close) => (
                    <ul className="delete-popup" style={{ listStyle: "none" }}>
                      <li>
                        <form
                          onSubmit={deleteTweet}
                          action={`http://localhost:5000/deleteTweet/${tweetId}`}
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
                          {(close) => (
                            <div className="comment-modal">
                              <form
                                style={{ marginBottom: "10px" }}
                                onSubmit={(e) => {
                                  editTweet(e);
                                  close();
                                }}
                                action={`http://localhost:5000/editTweet/${tweetId}`}
                              >
                                <input
                                  required
                                  autoFocus
                                  type="text"
                                  value={tweetContent}
                                  onChange={(e) => {
                                    setTweetContent(e.target.value);
                                  }}
                                ></input>
                                <br></br>
                                <button className="tweetBtn" type="submit">
                                  {" "}
                                  Edit
                                </button>
                              </form>
                            </div>
                          )}
                        </Popup>
                      </li>
                    </ul>
                  )}
                </Popup>
              )}
            </div>

            <div className="content">{props.body.content}</div>
            {props.body.image !== undefined && (
              <img className="tweetImage" src={`${props.body.image}`}></img>
            )}
            <div className="icons">
              <div style={{ color: btnColor }} className="icon">
                <form
                  onSubmit={handleSubmit}
                  style={{ marginBottom: "0" }}
                  className="likeForm"
                  action={`http://localhost:5000/post/${props.user}/like/${tweetId}`}
                  method="post"
                >
                  <button>
                    <AiOutlineLike />
                    <div className="like-count">{likeCount}</div>
                  </button>
                </form>
              </div>
              <div style={{ color: retweetBtnColor }} className="icon retweet">
                <form
                  onSubmit={handleRetweetSubmit}
                  style={{ marginBottom: "0" }}
                  className="retweetForm"
                  action={`http://localhost:5000/post/${props.user}/retweet/${tweetId}`}
                >
                  <button>
                    <AiOutlineRetweet />
                    <div className="retweet-count">{retweetCount}</div>
                  </button>
                </form>
              </div>
              <Popup
                trigger={
                  <button>
                    {" "}
                    <div className="icon comment">
                      <GoComment />
                      <div className="comment-count">{commentCount}</div>
                    </div>
                  </button>
                }
                modal
                position="center"
              >
                {(close) => (
                  <div className="comment-modal">
                    <Link to={`/profile/${props.body.postedBy.username}`}>
                      <div className="flex-introduction">
                        Replying to
                        <div className="postedBy" style={{ color: "#1DA1F2" }}>
                          @{props.body.postedBy.username}
                        </div>
                      </div>
                    </Link>
                    <form
                      style={{ marginBottom: "10px" }}
                      onSubmit={(e) => {
                        handleCommentSubmit(e);
                        close();
                      }}
                      method="post"
                      action={`http://localhost:5000/feed/comment/${tweetId}`}
                    >
                      <input
                        autoFocus
                        required
                        placeholder="Tweet your reply"
                        type="text"
                        value={commentInput}
                        onChange={handleChange}
                      ></input>
                      <br></br>
                      <button className="tweetBtn" type="submit">
                        {" "}
                        Reply
                      </button>
                    </form>
                  </div>
                )}
              </Popup>
            </div>
          </li>
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
            comments.map(function (comment) {
              return (
                <Comment
                  updateLoading={setLoading}
                  user={props.user}
                  tweetBy={props.body.postedBy.username}
                  body={comment}
                />
              );
            })
          )}
        </div>
      ) : (
        errorToast()
      )}
    </>
  );
}

export default Tweet;
