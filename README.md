# MERN-Twitter-clone

Twitter clone made using MERN Stack.

## Features

- Sign up/ Sign in via JWT Token
- Customize account
- Tweet
- Comment
- Like tweets and comments
- Retweet
- Edit tweets and comments
- Delete tweets and comments
- Follow

## Bugs

- Cannot tweet images when tweeting via the 'tweet' button in the sidebar
- Image which has been selected in the previous tweet is automatically tweeted again even though no image is selected

## Contribute

### Prerequisites

- node
- npm
- mongodb

1. Clone this repository
2. Install server dependencies

```
$ cd server
$ npm install
```

3. Install client dependencies

```
$ cd client
$ npm install
```

### Run the app

1. Start mongodb locally

```
$ mongod
```

2. Start the server

```
cd server
nodemon server.js
```

3. Start the client

```
cd client
npm start
```

## License

This project is made available under the MIT License.
