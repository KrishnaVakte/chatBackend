const Users = require("../models/usermodel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernamecheck = await Users.findOne({ username });
    if (usernamecheck) {
      return res.json({ msg: "Username already used", status: false });
    }
    const emailcheck = await Users.findOne({ email });
    if (emailcheck) {
      return res.json({ msg: "Email already used", status: false });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      email,
      username,
      password: hashpassword,
    });

    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const AvatarImage = req.body.image;
    const userData = await Users.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      AvatarImage,
    });
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.AvatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find({ _id: { $ne: req.params.id } }).select([
      "username",
      "email",
      "AvatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (error) {
    next(error);
  }
};
