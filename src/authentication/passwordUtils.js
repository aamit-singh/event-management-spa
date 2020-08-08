const crypto = require("crypto");

const generatePassword = (password) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { salt, hash: genHash };
};

const validatePassword = (password, user) => {
  const salt = user.salt;
  const hash = user.password;
  const calcHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === calcHash;
};

module.exports = { generatePassword, validatePassword };
