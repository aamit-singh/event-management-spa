const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    events: [],
  },
  { timestamp: true }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;
