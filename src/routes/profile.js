const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const { upload } = require("../middleware/uploads.js");
const {
  validatePassword,
  validateEditProfileData,
} = require("../utils/validator.js");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
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
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//password update

profileRouter.patch("/profile/passwordUpdate", userAuth, async (req, res) => {
  try {
    // validate password
    validatePassword(req);

    // encrypt password
    const passwordHash = await bcrypt.hash(req.body?.password, 10);
    //update password
    const id = req.user?._id;
    console.log(id, req.user, "user");
    await User.findByIdAndUpdate(req.user?._id, { password: passwordHash });
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Password Updated");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//profile edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // validate req body and check only allowed fields can be updated
    validateEditProfileData(req);

    // update user obj and save it or update it
    const user = req.user;
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    // await User.findByIdAndUpdate(user._id, req.body);
    await user.save();
    res.json({
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
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// upload image
profileRouter.patch(
  "/profile/uploadImage",
  userAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = req.user;
      const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

      user.profileURL = imageUrl;
      console.log(user);
      await user.save();
      res.json({
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
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = profileRouter;
