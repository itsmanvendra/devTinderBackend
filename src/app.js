const express = require("express");
const { connectDB } = require("./config/database.js");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");
const path = require("path");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
// app.use("/uploads", express.static("uploads"));
// ✅ Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB()
  .then(() => {
    console.log("database connected!!");
    app.listen(8000, () => console.log("server is running on port 8000"));
  })
  .catch((err) => console.log(err));
