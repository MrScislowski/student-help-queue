/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import config from "./config";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const app = express();
app.use(express.json());

import Active from "./models/active";
import Archived from "./models/archived";
import { parseActiveEntry, parseResolveRequest } from "./utils";

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

app.get("/ping", (_req, res) => {
  console.log("server received ping");
  res.send("pong");
});

app.get("/api/queue", async (_req, res) => {
  const results = await Active.find({});
  res.send(results);
});

app.get("/api/archived", async (_req, res) => {
  const results = await Archived.find({});
  res.send(results);
});

app.post("/api/queue", async (req, res) => {
  try {
    const reqData = parseActiveEntry(req.body);

    const hasDuplicate = await Active.findOne({
      requestorId: reqData.requestorId,
    });
    if (hasDuplicate) {
      return res
        .status(400)
        .send("user already has an entry in the active queue");
    }

    const newEntry = new Active(reqData);
    await newEntry.save();
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

  const foundEntry = await Active.findById(entryId);
  if (!foundEntry) {
    return res.status(404).send("Entry not found");
  }

  try {
    const resolutionData = parseResolveRequest(req.body);
    const archivedVersion = new Archived({
      ...(foundEntry.toObject() as object),
      resolveTimestamp: new Date().toISOString(),
      ...resolutionData,
    });
    await archivedVersion.save();
    await foundEntry.deleteOne();
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
  res.send("database cleared");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
