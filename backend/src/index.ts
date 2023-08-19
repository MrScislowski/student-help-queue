/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response, NextFunction } from "express";
import config from "./config";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next();
}, cors({ maxAge: 84600 }));

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
  res.send({
    timestamp: new Date().toISOString(),
    entries: results,
  });
});

app.get("/api/archived", async (_req, res) => {
  const results = await entriesService.getArchivedEntries();
  res.send({
    timestamp: new Date().toISOString(),
    entries: results,
  });
});

app.post("/api/queue", async (req, res) => {
  try {
    const reqData = parseActiveEntry(req.body);
    const newEntry = await entriesService.addActiveEntry(reqData);
    res.send({
      timestamp: new Date().toISOString(),
      entry: newEntry,
    });
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
    return res.send({
      timestamp: new Date().toISOString(),
      entry: archivedVersion,
    });
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

app.post("/api/fillrandom", async (_req, res) => {
  await Promise.all(
    Array.from({ length: 5 }, () =>
      Math.random().toString(36).substring(7)
    ).map((id) =>
      entriesService.addActiveEntry({
        requestor: { id: id, displayName: id },
      })
    )
  );

  res.send("5 random entries added");
});

app.post("/api/login", async (req, res) => {
  try {
    const client = new OAuth2Client(config.GOOGLE_OAUTH_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      idToken: req.body.credential,
      audience: config.GOOGLE_OAUTH_CLIENT_ID,
    });

    // TODO: do this parsing somewhere else
    const payload = ticket.getPayload();
    let email = "";
    let given_name = "";
    let family_name = "";
    if (
      payload &&
      typeof payload === "object" &&
      "email" in payload &&
      "given_name" in payload &&
      "family_name" in payload
    ) {
      email = payload.email ? payload.email : "";
      given_name = payload.given_name ? payload.given_name : "";
      family_name = payload.family_name ? payload.family_name : "";
    }
    const userForToken = { email, given_name, family_name };
    const token = jwt.sign(userForToken, config.SECRET);

    return res.send({ token, email, given_name, family_name });
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
