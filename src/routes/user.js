const mongoose = require("mongoose");
const express = require("express");
const { userAuth } = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
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
// get connections
userRouter.get("/user/matches", userAuth, async (req, res) => {
  try {
    // fetch directly from dB with status match
    const userId = req.user?._id;
    const connections = await connectionRequest
      .find({ fromUserID: userId, status: "match" })
      .populate("toUserID", USER_PUBLIC_DATAFEILDS);
    if (connections.length === 0) {
      return res.send("No Matches Found!");
    }

    const data = connections.map((item) => item.toUserID);
    res.json({ message: "Connection List", data: data });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

// get who swipe right on me
userRouter.get("/user/pendingRequests", userAuth, async (req, res) => {
  try {
    // fetch directly from dB
    const pendingRequestsList = await connectionRequest
      .find({ toUserID: req.user?._id, status: "like" })
      .populate("fromUserID", USER_PUBLIC_DATAFEILDS);
    if (pendingRequestsList.length === 0) {
      return res.json({ message: "No pending Request Found" });
    }
    const data = pendingRequestsList.map((item) => item.fromUserID);
    res.json({ message: "List of Pending Requests", data: data });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

// feed api
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // user should exclude himself and all connections
    const userId = req.user?._id;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const connectionList = await connectionRequest
      .find({ $or: [{ fromUserID: userId }, { toUserID: userId }] })
      .select("fromUserID toUserID");
    const hideUserFromFeedSet = new Set();
    connectionList.forEach((item) => {
      hideUserFromFeedSet.add(item.toUserID.toString());
      hideUserFromFeedSet.add(item.fromUserID.toString());
    });
    // hiding myself from the fee
    hideUserFromFeedSet.add(userId.toString());
    const hideUserFromFeed = Array.from(hideUserFromFeedSet).map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const userList = await User.find({ _id: { $nin: hideUserFromFeed } })
      .select(USER_PUBLIC_DATAFEILDS)
      .skip(skip)
      .limit(limit);
    res.json({ data: userList, message: userList.length + "users found" });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = userRouter;
