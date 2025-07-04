const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const userAuth = async (req, res, next) => {
  try {
    // check token is available
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }
    //validate the jwt token
    const decodedObj = jwt.verify(token, "Dev@Tinder9097");

    // find user and then attach user to request
    const user = await User.findById(decodedObj._id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
};

module.exports = { userAuth };
