const validator = require("validator");
const validateSignUpData = (req) => {
  const { fullName, emailId, password } = req.body;

  if (!fullName) {
    throw new Error("Name is a required feild");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is invalid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Use at least 8 characters with a mix of letters, numbers, and symbols."
    );
  }
};

const validatePassword = (req) => {
  const { password } = req.body;
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Use at least 8 characters with a mix of letters, numbers, and symbols."
    );
  }
};

const validateEditProfileData = (req) => {
  const ALLOWED_FIELDS = [
    "profileURL",
    "githubURL",
    "techStack",
    "age",
    "gender",
    "lookingFor",
    "codingLevel",
    "yoe",
    "portfolioURL",
    "about",
  ];

  const isOnlyAllowedFieldsUpdated = Object.keys(req.body).every((k) =>
    ALLOWED_FIELDS.includes(k)
  );
  if (!isOnlyAllowedFieldsUpdated) {
    throw new Error("Try to edit restricted field");
  }
  if (req.body && req.body.about && req.body.about.length > 200) {
    throw new Error("Max 200 characters allowed");
  }
};

module.exports = {
  validateSignUpData,
  validatePassword,
  validateEditProfileData,
};
