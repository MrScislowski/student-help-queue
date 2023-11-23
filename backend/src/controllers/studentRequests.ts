/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, Request, Response, NextFunction } from "express";
import { ActiveQueue, Session } from "../types";
import { parseBodyString, parseSession } from "../utils";
import jwt from "jsonwebtoken";
import config from "../config";
import activeQueueService from "../services/activeQueueService";

const router = Router();

const mockSession: Session = {
  user: {
    email: "testuser@gmail.com",
    familyName: "smith",
    givenName: "john",
  },
  selectedClass: {
    name: "exampleClass",
    teacherEmail: "teacherexample@gmail.com",
  },
};

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  let sessionInfo;

  if (config.DISABLE_AUTH) {
    sessionInfo = mockSession;
  } else {
    if (!req.headers.authorization) {
      return res.status(400).send("Token required in authorization header");
    }

    const token = req.headers.authorization.substring(7);
    sessionInfo = parseSession(jwt.verify(token, config.SECRET));
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  res.locals.session = sessionInfo;
  next();
};

router.use(authenticateToken);

router.get("/:classId", async (req, res) => {
  const classId = req.params.classId;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  try {
    const queues: ActiveQueue[] = await activeQueueService.getQueuesForStudent(
      classId
    );

    res.send(queues);
  } catch (error: unknown) {
    let message = "";
    if (error instanceof Error) {
      message += error.message;
    }
    return res.status(500).send({ error: message });
  }
});

router.post("/:classId", async (req, res) => {
  try {
    const classId = req.params.classId;

    const queueId = parseBodyString(req.body, "queueId");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    await activeQueueService.addActiveEntry(session.user, classId, queueId);
    res.status(200).send();
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
