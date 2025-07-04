const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://imanvendra03:qjQ2kD7LmJgYj4qs@namastenode.suuealy.mongodb.net/devTinder"
  );
};

module.exports = { connectDB };
