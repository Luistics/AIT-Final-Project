# GangUp (Squad Matcher for Video Games)

## Overview

More often than not you find yourself buying a game that you really enjoy, but your friends just can't get into it. Other times, you may find yourself wanting to play with a group that is at your skill level, but enjoys messing around every once in a while.

Finding the exact people you want to play video games with is tough. GangUp makes it as easy as a couple of taps to the right.
(Essentially, it is a web app that functions sort of like Tinder.
Every user can customize their profile, advertising what they like to do,
their skills, what games they like to play, etc.).

## Data Model

The application will store Users and Profiles

- users can have multiple strategy authentication types
- users can have multiple likes (ennumeration)
- users have only one profile (one to one)
- etc.

An Example User with embedded matches:

```javascript
const userSchema = new Schema({

    local:{
        username: {
            type: String,
            unique: true
        },
        password: String,
        profile: {type:Schema.Types.ObjectId, ref: 'Profile'},
    },

    facebook:{
        username:{}
        email: {}
    }
});
```

An Example Profile:

```javascript
const profileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  username: String,
  epicID: { type: String },
  psnID: { type: String },
  xboxLiveID: { type: String },
  location: { type: String, default: "Unknown" },
  games: [String],
  gameData: String,
  age: Number,
  description: String,
  gender: String,
  likes: [String]
});
```

## [Link to Schemas](app/models)

## User Stories or Use Cases

1.  as non-registered user, I can register a new account with the site (mandatory registration)
2.  as a user, I can log in to the site
3.  as a user, I will be asked to fill in a form with to be my profile if my profile does not exist.
4.  as a user, I can "swipe" left or right on users that I may be interested in playing with while playing GangUp!
5.  as a user, I can edit some fields of my profile at any time that I am logged in.
6.  as a user, I can see a list of all the users I like on my profile page, and see the users other people like on their profile pages.

## Research Topics

- (5 points) Integrate user authentication
  - Going to look into passport, using passport-local strategy for authentication.
- (2 points) Bootstrap CSS
  - Use bootstrap templating throughout the site.

7 points total out of 8 required points.

## [Link to Initial Main Project File](app.js)

## Annotations / References Used

- https://scotch.io/tutorials/easy-node-authentication-setup-and-local
- Class Ajax slides
- https://getbootstrap.com/docs/3.3/getting-started/
- https://www.w3schools.com/bootstrap/default.asp
