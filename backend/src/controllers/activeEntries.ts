/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, Request, Response, NextFunction } from "express";
import { ActiveQueue, ResolutionStatus, Session } from "../types";
import { parseResolutionStatus, parseSession } from "../utils";
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

router.get("/classes/:classId/queues", async (req, res) => {
  const classId = req.params.classId;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  try {
    const queues: ActiveQueue[] = await activeQueueService.getQueuesForStudent(
      classId
    );

    res.send({
      queues: queues,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    let message = "";
    if (error instanceof Error) {
      message += error.message;
    }
    return res.status(500).send({ error: message });
  }
});

router.post("/classes/:classId/queues/:queueId", async (req, res) => {
  try {
    const classId = req.params.classId;
    const queueId = req.params.queueId;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    await activeQueueService.addActiveEntry(session.user, classId, queueId);
    res.status(200).send();
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/classes/:classId/queues/:queueId", async (req, res) => {
  try {
    const classId = req.params.classId;
    const queueId = req.params.queueId;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    const status: ResolutionStatus = parseResolutionStatus(
      req.body.resolutionStatus
    );

    await activeQueueService.resolveEntry(
      session.user,
      classId,
      queueId,
      status
    );
    res.status(200).send();
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
