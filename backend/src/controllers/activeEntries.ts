/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { User } from "../types";
import { ActiveEntry } from "../types";
import jwt from "jsonwebtoken";
import { parseArchivedEntry, parseString, parseUser } from "../utils";
import entriesService from "../services/entriesService";
import config from "../config";

const router = Router();

router.get("/", async (req, res) => {
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

router.post("/", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(400).send("token required in authorization header");
  }
  const token = req.headers.authorization.substring(7);

  const userInfo = parseUser(jwt.verify(token, config.SECRET));

  try {
    if (!("queueName" in req.body) || !req.body.queueName) {
      throw new Error("queueName not specified");
    }
    const queueName = parseString(req.body.queueName);
    const newEntry = await entriesService.addActiveEntry(userInfo, queueName);

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

router.post("/:id", async (req, res) => {
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

export default router;
