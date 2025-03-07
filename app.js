require("dotenv").config();
const express = require("express");
const uploadRouter = require("./routes/uploadRouter");
const statusRouter = require("./routes/statusRouter");
const imageRouter = require("./routes/imageRouter");
const csvRouter = require("./routes/csvRouter");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.SERVER_PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/product", uploadRouter);
app.use("/status", statusRouter);
app.use("/images", imageRouter);
app.use("/csv", csvRouter);
app.get("/", (req, res) => {
  res.send("Welcome to the image processing service!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
