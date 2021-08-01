const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const mongoose = require("mongoose");

const app = express();
const PORT = 3030;

// Database
mongoose.connect("mongodb://localhost/venue", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("connected to database 💻");
});

app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.get("/", (req, res) => res.send("Welcome to venue picker"));

app.listen(PORT, () => {
  console.log("server is running on port 3030 🚀");
});
