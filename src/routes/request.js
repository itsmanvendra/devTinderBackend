const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const User = require("../models/user.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const mongoose = require("mongoose");
const USER_PUBLIC_DATAFEILDS = [
  "fullName",
  "about",
  "profileURL",
  "gender",
  "techStack",
  "portfolioURL",
  "githubURL",
  "yoe",
  "codingLevel",
  "lookingFor",
  "age",
];

requestRouter.post("/request/:status/:userId", userAuth, async (req, res) => {
  try {
    const status = req.params.status;
    const userId = req.params.userId;

    // validate status it should be pass or like
    const ALLOWED_STATUS = ["pass", "like"];
    if (!ALLOWED_STATUS.includes(status)) {
      throw new Error("Status is not valid");
    }
    //validate userID userID exist in DB and not be same as fromUserID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid UserId");
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("No User Found!");
    }

    if (user._id.equals(req.user?._id)) {
      throw new Error("Can't " + status + " to yourself!");
    }
    // check if user already has liked or passed that user
    const isConnectionAlreadyInDB = await ConnectionRequest.findOne({
      fromUserID: req.user?._id,
      toUserID: userId,
    });
    if (isConnectionAlreadyInDB) {
      throw new Error("Connection already exist!");
    }
    const newConnection = new ConnectionRequest({
      fromUserID: req.user?._id,
      toUserID: userId,
      status: status,
    });
    // check that user has liked it if this user has liked it -> if yes update status to match
    if (status === "like") {
      const checkUserSwipedOrNot = await ConnectionRequest.findOne({
        fromUserID: userId,
        toUserID: req.user?._id,
      })
        .populate("fromUserID", USER_PUBLIC_DATAFEILDS)
        .populate("toUserID", USER_PUBLIC_DATAFEILDS);
      if (checkUserSwipedOrNot && checkUserSwipedOrNot.status === "like") {
        // update to match in both connectionRequest and save;
        newConnection.status = "match";
        await newConnection.save();
        checkUserSwipedOrNot.status = "match";
        await checkUserSwipedOrNot.save();
        return res.json({
          message: "Its a match!!!",
          data: checkUserSwipedOrNot,
        });
      }
    }

    await newConnection.save();
    res.send(req.user?.fullName + " " + status + " " + user.fullName);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = requestRouter;
