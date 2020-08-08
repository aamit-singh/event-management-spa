var express = require("express");
var router = express.Router();
const passport = require("../authentication/passport-config");

const register = require("./register");
const User = require("../models/userModel");

/* api listing. */

// user verifications
router.post("/register", register);

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: req.user, msg: "user logged in sucessfully" });
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.status(200).json({ msg: "succesfully logged out" });
});

router.get("/auth", function (req, res) {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(200).json({ err: "Not logged in" });
  }
});

//  check for authentication
router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ err: "the user is not logged in" });
  }
});

router.get("/events", (req, res) => {
  res.status(200).json({ events: req.user.events });
});

router.post("/addEvent", (req, res) => {
  const name = req.body.eventName;
  const description = req.body.eventDescription;
  User.findById({ _id: req.user._id })
    .then((user) => {
      let event = { name, description };
      user.events = [...user.events, event];
      user.isModified("events");
      user
        .save()
        .then((data) => {
          res.send("event saved");
        })
        .catch((err) => {
          res.status(500).send("Can't save event.");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Can't save event. Database error");
    });
});

module.exports = router;
