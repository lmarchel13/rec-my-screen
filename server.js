const express = require("express");
const { join } = require("path");

const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.listen(3000, console.log("Server running at http://localhost:3000"));
