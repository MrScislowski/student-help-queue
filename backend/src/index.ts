/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response, NextFunction } from "express";
import config from "./config";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "./types";

const app = express();
app.use(express.json());
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next();
}, cors({ maxAge: 84600 }));

import Active from "./models/active";
import Archived from "./models/archived";
import {
  hasAdminRights,
  parseArchivedEntry,
  parseLoginPayload,
  parseUser,
} from "./utils";
import entriesService from "./services/entriesService";
import { ActiveEntry } from "./types";

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

app.get("/api/queue", async (req, res) => {
  let userInfo: User;
  if (!req.headers.authorization) {
    userInfo = { email: "", familyName: "", givenName: "" };
  } else {
    const token = req.headers.authorization.substring(7);
    userInfo = parseUser(jwt.verify(token, config.SECRET));
  }

  const results: Omit<ActiveEntry, "_id">[] =
    await entriesService.getActiveEntries(userInfo);
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
  if (!req.headers.authorization) {
    return res.status(400).send("token required in authorization header");
  }
  const token = req.headers.authorization.substring(7);

  const userInfo = parseUser(jwt.verify(token, config.SECRET));

  try {
    const newEntry = await entriesService.addActiveEntry(userInfo);

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
  if (!req.headers.authorization) {
    return res.status(400).send("token required in authorization header");
  }
  const token = req.headers.authorization.substring(7);

  const userInfo = parseUser(jwt.verify(token, config.SECRET));

  try {
    const resolutionData = parseArchivedEntry(req.body);
    const archivedVersion = await entriesService.resolveActiveEntry(
      entryId,
      userInfo,
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

app.post("/api/login", async (req, res) => {
  try {
    const client = new OAuth2Client(config.GOOGLE_OAUTH_CLIENT_ID);

    if (!("credential" in req.body)) {
      throw new Error("credential required");
    }

    const ticket = await client.verifyIdToken({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      idToken: req.body.credential,
      audience: config.GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const userInfo = parseLoginPayload(payload);

    const token = jwt.sign(userInfo, config.SECRET);

    return res.send({ ...userInfo, isAdmin: hasAdminRights(userInfo), token });
  } catch (error) {
    let message = "Error(s) occurred: ";
    if (error instanceof Error) {
      message += error.message;
    }
    return res.status(500).send(message);
  }
});

app.get("/", (_req, res) => {
  res.send("welcome");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
