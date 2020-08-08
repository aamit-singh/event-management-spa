const User = require("../models/userModel");
const { generatePassword } = require("../authentication/passwordUtils");

register = (req, res, next) => {
  const body = req.body;
  const { userName, userEmail, password } = body;
  User.findOne({ userEmail }).then((user) => {
    if (!!user) {
      res.status(409).send("User already exists.");
    } else {
      let { salt, hash } = generatePassword(password);
      let user = new User({
        userName,
        userEmail,
        password: hash,
        salt,
      });
      user
        .save()
        .then((data) => {
          //   console.log("registered", data);
          res.user = data;
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

module.exports = register;
