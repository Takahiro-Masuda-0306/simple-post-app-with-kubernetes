const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send({});
});

app.post("/events", (req, res) => {
  console.log("Events Received", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("v55");
  console.log("listening on 4000");
});
