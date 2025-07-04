const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email Address is Invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must contain minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"
          );
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    profileURL: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s",
    },
    githubURL: {
      type: String,
    },
    portfolioURL: {
      type: String,
    },
    codingLevel: {
      type: String,
    },
    lookingFor: {
      type: String,
    },
    yoe: {
      type: String,
    },

    about: {
      type: String,
      trim: true,
    },
    techStack: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;
  return jwt.sign({ _id: user._id }, "Dev@Tinder9097", {
    expiresIn: "7d",
  });
};

userSchema.methods.validatePassword = async function (passwordEntered) {
  const user = this;
  const passwordHash = user?.password;

  return await bcrypt.compare(passwordEntered, passwordHash);
};
module.exports = mongoose.model("Users", userSchema);
