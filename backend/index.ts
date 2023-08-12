import express from "express";
import config from "./config";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const app = express();
app.use(express.json());

import Active from "./models/active";

const PORT = config.PORT;
const MONGODB_URI = config.DB_URL;

const randString = (): string => {
  return (Math.random() + 1).toString(36).substring(7);
};

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err.message}`);
  });

app.get("/ping", (_req, res) => {
  console.log("server received ping");
  res.send("pong");
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get("/addrandom", async (_req, res) => {
  const newActiveTicket = new Active({
    id: randString(),
    requestorDisplayName: randString(),
    requestorId: randString(),
    requestTimestamp: randString(),
  });
  await newActiveTicket.save();
  res.send(newActiveTicket);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get("/getall", async (_req, res) => {
  const results = await Active.find({});
  res.send(results);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
