import express from "express";
import config from "./config";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const app = express();
app.use(express.json());

import Active from "./models/active";
import Archived from "./models/archived";
import { ActiveEntry } from "./types";

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
  const newActiveTicket: mongoose.Document = new Active({
    requestorId: randString(),
    requestorDisplayName: randString(),
    requestTimestamp: randString(),
  });
  await newActiveTicket.save();
  res.send(newActiveTicket);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get("/resolverandom", async (_req, res) => {
  const allActive = await Active.find({});
  if (allActive.length === 0) {
    return res.send("no active entries");
  }

  const chosenIndex = Math.floor(Math.random() * allActive.length);
  const chosenEntry = allActive[chosenIndex];
  const chosenEntryData: ActiveEntry = chosenEntry.toObject();
  const archivedVersion = new Archived({
    ...chosenEntryData,
    resolverId: randString(),
    resolverDisplayName: randString(),
    resolveTimestamp: randString(),
    resolutionStatus: Math.random() > 0.5 ? "cancel" : "resolve",
  });
  await archivedVersion.save();
  await chosenEntry.deleteOne();

  res.send("deleted, I think...");
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get("/getActive", async (_req, res) => {
  const results = await Active.find({});
  res.send(results);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get("/getArchived", async (_req, res) => {
  const results = await Archived.find({});
  res.send(results);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
