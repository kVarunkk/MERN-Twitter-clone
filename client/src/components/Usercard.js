import React from "react";
import { Link } from "react-router-dom";

function Usercard(props) {
  return (
    <Link to={`/profile/${props.username}`}>
      <div className="card">
        <div className="card-img">
          <img
            className="tweet-avatar"
            src={`http://localhost:5000/images/${props.avatar}`}
          ></img>
        </div>
        <div className="card-text">
          <div className="card-text-username">{props.username}</div>
          <div className="card-text-follow">
            <div className="card-text-followers">
              {props.followers.length} followers
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Usercard;
