const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validator.js");
const User = require("../models/user.js");
const { userAuth } = require("../middleware/auth.js");

authRouter.post("/signup", async (req, res) => {
  try {
    // validate your req.body
    validateSignUpData(req);
    //imp info schema level validation happens before saving it to moongose, not here so we have to write our own email and password api level validation
    const { fullName, emailId, password } = req.body;
    // password encryption
    const passwordHash = await bcrypt.hash(password, 10);

    // creating new instance of the user
    const user = new User({
      fullName,
      emailId,
      password: passwordHash,
    });

    //saving the data into database
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).send("Something Went wrong " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User not found.");
    }
    const isPasswordVerified = await user.validatePassword(password);
    if (!isPasswordVerified) {
      throw new Error("Incorrect Password");
    } else {
      // one password is verified then create json web token and store in a form of cookie

      const token = user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }); // expire in 7d
      res.json({
        message: "User LoggedIn Successfully",
        data: {
          name: user.fullName,
          email: user.emailId,
          profileURL: user.profileURL,
          age: user.age,
          gender: user.gender,
          techStack: user.techStack,
          lookingFor: user.lookingFor,
          codingLevel: user.codingLevel,
          yoe: user.yoe,
          githubURL: user.githubURL,
          portfolioURL: user.portfolioURL,
          about: user.about,
          id: user._id,
        },
      });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("User Logged In Successfully");
});

module.exports = authRouter;
