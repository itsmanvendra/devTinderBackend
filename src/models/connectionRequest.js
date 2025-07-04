const mongoose = require('mongoose');
const User = require("../models/user");

const connectionRequestSchema = new mongoose.Schema({
    fromUserID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: User,
    },
    toUserID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    status: String,
}, {timestamps: true});

connectionRequestSchema.index({fromUserID: 1, toUserID: 1});


module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);