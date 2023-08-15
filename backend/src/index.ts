/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import config from "./config";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const app = express();
app.use(express.json());

import Active from "./models/active";
import Archived from "./models/archived";
import { parseActiveEntry, parseArchivedEntry } from "./utils";
import entriesService from "./services/entriesService";

const PORT = config.PORT;
const MONGODB_URI = config.DB_URL;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err.message}`);
  });

app.get("/api/queue", async (_req, res) => {
  const results = await entriesService.getActiveEntries();
  res.send(results);
});

app.get("/api/archived", async (_req, res) => {
  const results = await entriesService.getArchivedEntries();
  res.send(results);
});

app.post("/api/queue", async (req, res) => {
  try {
    const reqData = parseActiveEntry(req.body);
    const newEntry = await entriesService.addActiveEntry(reqData);
    res.send(newEntry);
  } catch (error: unknown) {
    let errorMessage = "Error occurred. ";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(400).send(errorMessage);
  }
});

app.post("/api/queue/:id", async (req, res) => {
  const entryId = req.params.id;

  try {
    const resolutionData = parseArchivedEntry(req.body);
    const archivedVersion = await entriesService.resolveActiveEntry(
      entryId,
      resolutionData
    );
    return res.send(archivedVersion);
  } catch (e: unknown) {
    let errorMessage = "Error occurred. ";
    if (e instanceof Error) {
      errorMessage += e.message;
    }
    return res.status(400).send(errorMessage);
  }
});

app.post("/api/clear", async (_req, res) => {
  await Active.deleteMany({});
  await Archived.deleteMany({});
  res.send("databases cleared");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
