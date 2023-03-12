const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");
const cors = require("cors");
const { User, Tweet, Comment } = require("./models/File");
const app = express();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/images", express.static("images"));
app.use("/tweetImages", express.static("tweetImages"));

mongoose.connect("mongodb://127.0.0.1/mernDB", (err) => {
  if (err) console.log(err);
  else console.log("mongdb is connected");
});

//sign in
app.post("/", (req, res) => {
  const userLogin = req.body;
  User.findOne({ username: userLogin.username }).then((dbUser) => {
    if (!dbUser) {
      return res.json({
        status: "error",
        error: "Invalid login",
      });
    }
    bcrypt.compare(userLogin.password, dbUser.password).then((isCorrect) => {
      if (isCorrect) {
        const payload = {
          id: dbUser._id,
          username: dbUser.username,
        };
        const token = jwt.sign(payload, "newSecretKey", { expiresIn: 86400 });
        return res.json({ status: "ok", user: token });
      } else {
        return res.json({ status: "error", user: false });
      }
    });
  });
});

//sign up
app.post("/signup", async (req, res) => {
  const user = req.body;
  const takenUsername = await User.findOne({ username: user.username });

  if (takenUsername) {
    return res.json({ status: "error", error: "username already taken" });
  } else {
    user.password = await bcrypt.hash(req.body.password, 10);

    const dbUser = new User({
      username: user.username.toLowerCase(),
      password: user.password,
      avatar: "initial-avatar.png",
    });

    dbUser.save();
    return res.json({ status: "ok" });
  }
});

//feed
app.get("/feed", async (req, res) => {
  const token = req.headers["x-access-token"];

  const tweetsToSkip = req.query.t || 0;

  try {
    const decoded = jwt.verify(token, "newSecretKey");
    const username = decoded.username;
    const user = await User.findOne({ username: username });
    Tweet.find({ isRetweeted: false })
      .populate("postedBy")
      .populate("comments")
      .sort({ createdAt: -1 })
      .skip(tweetsToSkip)
      .limit(20)
      .exec((err, docs) => {
        if (!err) {
          //to know if a person has liked tweet
          docs.forEach((doc) => {
            if (!doc.likes.includes(username)) {
              doc.likeTweetBtn = "black";
              doc.save();
            } else {
              doc.likeTweetBtn = "deeppink";
              doc.save();
            }
          });

          //to know if a person has liked comment
          docs.forEach((doc) => {
            doc.comments.forEach((docComment) => {
              if (!docComment.likes.includes(username)) {
                docComment.likeCommentBtn = "black";
                docComment.save();
              } else {
                docComment.likeCommentBtn = "deeppink";
                docComment.save();
              }
            });
          });

          //to know if a person has retweeted the tweet
          docs.forEach((doc) => {
            if (!doc.retweets.includes(username)) {
              doc.retweetBtn = "black";
            } else {
              doc.retweetBtn = "green";
            }
          });

          return res.json({
            status: "ok",
            tweets: docs,
            activeUser: user,
          });
        }
      });
  } catch (error) {
    return res.json({ status: "error", error: "Session ended :(" });
  }
});

//populate comments of a particular tweet
app.get("/feed/comments/:tweetId", (req, res) => {
  Tweet.find({ postedTweetTime: req.params.tweetId })
    .populate("postedBy")

    .populate({
      path: "comments",
      populate: [{ path: "postedBy" }],
    })
    .exec((err, tweet) => {
      if (!err) {
        return res.json({
          status: "ok",
          tweet: tweet,
        });
      } else return res.json({ status: "error", error: "comments not found" });
    });
});

//compose tweet

const storageEngine1 = multer.diskStorage({
  destination: "tweetImages",
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, callback) => {
  let pattern = /jpg|png|jpeg/; // reqex

  if (pattern.test(path.extname(file.originalname))) {
    callback(null, true);
  } else {
    callback("Error: not a valid file");
  }
};

const upload = multer({
  storage: storageEngine1,
  fileFilter,
});

app.post("/feed", (req, res) => {
  const info = req.body;
  const tweetInfo = JSON.parse(req.body.tweet);

  newTweet = Tweet.create(
    {
      content: tweetInfo.content,
      retweets: [],
      postedTweetTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
    },
    (err, newTweet) => {
      if (!err) {
        if (info.image) {
          newTweet.image = info.image;
        } else console.log("no image found");
        User.findOne({ username: tweetInfo.postedBy.username }, (err, doc) => {
          if (!err) {
            newTweet.postedBy = doc._id;
            if (newTweet.postedBy) {
              newTweet.save();
              doc.tweets.unshift(newTweet._id);
              doc.save();
              return res.json({ image: info.image });
            } else
              return res.json({ status: "error", error: "An error occured" });
          } else
            return res.json({ status: "error", error: "An error occured" });
        });
      }
    }
  );
});

//compose comment
app.post("/feed/comment/:tweetId", (req, res) => {
  Comment.create(
    {
      content: req.body.content,
      postedCommentTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
    },
    (err, newComment) => {
      if (!err) {
        Tweet.findOne({ postedTweetTime: req.params.tweetId }, (err, doc) => {
          if (!err) {
            User.findOne(
              { username: req.body.postedBy.username },
              (err, user) => {
                if (!err) {
                  newComment.postedBy = user._id;
                  if (newComment.postedBy) {
                    newComment.save();
                    doc.comments.unshift(newComment._id);
                    doc.save();
                  } else
                    return res.json({
                      status: "error",
                      error: "An error occured",
                    });
                }
              }
            );

            return res.json({
              comments: doc.comments.length,
              docs: doc.comments,
            });
          } else
            return res.json({ status: "error", error: "An error occured" });
        });
      }
    }
  );
});

//retweet
app.route("/post/:userName/retweet/:tweetId").post((req, res) => {
  Tweet.findOne({ postedTweetTime: req.params.tweetId }, (err, doc) => {
    if (!err) {
      if (!doc.retweets.includes(req.params.userName)) {
        //create a new tweet
        newTweet = Tweet.create(
          {
            content: doc.content,
            postedBy: doc.postedBy,
            likes: doc.likes,
            likeTweetBtn: doc.likeTweetBtn,
            image: doc.image,
            postedTweetTime: doc.postedTweetTime,
            retweetedByUser: req.params.userName,
            isRetweeted: true,
            retweetBtn: "green",
            retweets: [req.params.userName],
          },
          (err, newTweet) => {
            if (!err) {
              User.findOne({ username: req.params.userName }, (err, doc) => {
                if (!err) {
                  doc.tweets.unshift(newTweet._id);
                  doc.save();
                } else console.log(err);
              });
            }
          }
        );

        //update the number of retweets
        doc.retweets.push(req.params.userName);

        doc.retweetBtn = "green";
        doc.save();
      } else {
        const user = req.params.user;
        Tweet.find({})
          .populate("postedBy")
          .deleteOne(
            {
              "postedBy.username": user,
              content: doc.content,
              isRetweeted: true,
            },
            (err, res) => {
              console.log(res);
            }
          );

        let indexForRetweets = doc.retweets.indexOf(req.params.userName);
        doc.retweets.splice(indexForRetweets, 1);
        doc.retweetBtn = "black";

        doc.save();
      }
    } else console.log(err);
  });
});

//like tweet
app.route("/post/:userName/like/:tweetId").post((req, res) => {
  Tweet.find({ postedTweetTime: req.params.tweetId }, (err, docs) => {
    docs.forEach((doc) => {
      if (!err) {
        if (!doc.likes.includes(req.params.userName)) {
          doc.likes.push(req.params.userName);
          doc.likeTweetBtn = "deeppink";
          doc.save();
        } else {
          let indexForLikes = doc.likes.indexOf(req.params.userName);
          doc.likes.splice(indexForLikes, 1);
          doc.likeTweetBtn = "black";
          doc.save();
        }
      } else console.log(err);
    });
  });
});

//like comment
app.route("/comment/:userName/like/:commentId").post((req, res) => {
  Comment.findOne({ postedCommentTime: req.params.commentId }, (err, doc) => {
    if (!err) {
      if (!doc.likes.includes(req.params.userName)) {
        doc.likes.push(req.params.userName);
        doc.likeCommentBtn = "deeppink";
        doc.save();
        return res.json({ btnColor: "deeppink", likes: doc.likes.length });
      } else {
        let indexForLikes = doc.likes.indexOf(req.params.userName);
        doc.likes.splice(indexForLikes, 1);
        doc.likeCommentBtn = "black";
        doc.save();
        return res.json({ btnColor: "black", likes: doc.likes.length });
      }
    } else console.log(err);
  });
});

//delete tweet
app.route("/deleteTweet/:tweetId").post((req, res) => {
  Tweet.findOneAndDelete({ postedTweetTime: req.params.tweetId }, (err) => {
    if (!err) {
      return res.json({
        status: "ok",
      });
    } else console.log(err);
  });
});

//delete comment
app.route("/deleteComment/:commentId").post((req, res) => {
  Comment.findOneAndDelete(
    { postedCommentTime: req.params.commentId },
    (err) => {
      if (!err) {
        return res.json({
          status: "ok",
        });
      } else console.log(err);
    }
  );
});

//edit tweet
app.route("/editTweet/:tweetId").post((req, res) => {
  Tweet.findOne({ postedTweetTime: req.params.tweetId }, (err, doc) => {
    doc.content = req.body.content;
    doc.isEdited = true;
    doc.save();
    return res.json({
      status: "ok",
    });
  });
});

//edit comment
app.route("/editComment/:commentId").post((req, res) => {
  Comment.findOne({ postedCommentTime: req.params.commentId }, (err, doc) => {
    doc.content = req.body.content;
    doc.isEdited = true;
    doc.save();
    return res.json({
      status: "ok",
    });
  });
});

//upload image
const storageEngine = multer.diskStorage({
  destination: "images",
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload1 = multer({
  storage: storageEngine,
  fileFilter,
});

app.post("/avatar/:userName", (req, res) => {
  User.findOne({ username: req.params.userName }, (err, user) => {
    if (!err) {
      user.avatar = req.body.avatar;
      if (user.avatar) {
        user.save();
        return res.json({ status: "ok", avatar: req.body.avatar });
      }
    } else return res.json({ status: "error", error: "Please upload again" });
  });
});

//user profile
app.get("/profile/:userName", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "newSecretKey");
    const username = decoded.username;
    User.findOne({ username: req.params.userName })
      .populate({
        path: "tweets",
        populate: [
          { path: "postedBy" },
          { path: "comments", populate: [{ path: "postedBy" }] },
        ],
      })

      .exec((err, doc) => {
        if (!err) {
          if (!doc.followers.includes(username)) {
            doc.followBtn = "Follow";
          } else doc.followBtn = "Following";

          doc.tweets.forEach((tweet) => {
            if (!tweet.likes.includes(username)) {
              tweet.likeTweetBtn = "black";
            } else tweet.likeTweetBtn = "deeppink";
          });

          doc.tweets.forEach((tweet) => {
            if (!tweet.retweets.includes(username)) {
              tweet.retweetBtn = "black";
            } else tweet.retweetBtn = "green";
          });

          return res.json({
            status: "ok",
            tweets: doc.tweets,
            followers: doc.followers.length,
            followBtn: doc.followBtn,
            activeUser: username,
            avatar: doc.avatar,
          });
        } else console.log(err);
      });
  } catch (error) {
    return res.json({ status: "error", error: "invalid token" });
  }
});

//follow
//userName= active user
//user= profile
app.route("/user/:user/follow/:userName").post((req, res) => {
  User.findOne({ username: req.params.userName }, (err, doc) => {
    if (!err) {
      if (doc.username !== req.params.user) {
        if (!doc.followers.includes(req.params.user)) {
          doc.followers.push(req.params.user);
          doc.followBtn = "Following";
          doc.save();
        } else {
          let indexForUnFollow = doc.followers.indexOf(req.params.user);
          doc.followers.splice(indexForUnFollow, 1);
          doc.followBtn = "Follow";
          doc.save();
        }
        return res.json({
          followers: doc.followers.length,
          followBtn: doc.followBtn,
        });
      }
    }
  });
});

// search page

app.get("/search/:user", (req, res) => {
  // console.log(req.params.user);
  User.find(
    { username: { $regex: `${req.params.user}`, $options: "i" } },
    function (err, docs) {
      if (!err) {
        return res.json({ status: "ok", users: docs });
      } else return res.json({ status: "error", error: err });
    }
  );
});

app.listen("5000", () => {
  console.log("server running on port 5000");
});
