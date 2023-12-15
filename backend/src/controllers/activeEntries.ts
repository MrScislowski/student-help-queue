/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, Request, Response, NextFunction } from "express";
import { ActiveQueue, ResolutionStatus, Session } from "../types";
import { parseResolutionStatus, parseSession, parseString } from "../utils";
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

router.get("/:classId/queues", async (req, res) => {
  const classId = req.params.classId;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  try {
    const queues = await activeQueueService.getQueuesForClass(classId);

    if (queues === null) {
      return res.status(404).send({ error: `Class ${classId} not found` });
    }

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

router.post("/:classId/queues/:queueId", async (req, res) => {
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

router.delete("/:classId/queues/:queueId", async (req, res) => {
  try {
    const classId = req.params.classId;
    const queueId = req.params.queueId;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    const status: ResolutionStatus = parseResolutionStatus(
      req.body.resolutionStatus
    );

    if (req.body.email) {
      const email = parseString(req.body.email);
      await activeQueueService.resolveOthersEntry(
        session.user,
        email,
        classId,
        queueId,
        status
      );
      res.status(200).send();
      return;
    } else {
      await activeQueueService.resolveMyEntry(
        session.user,
        classId,
        queueId,
        status
      );
      res.status(200).send();
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch("/:classId/queues/:queueId", async (req, res) => {
  try {
    const classId = req.params.classId;
    const queueId = req.params.queueId;
    const queueName = parseString(req.body.queueName);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    await activeQueueService.renameQueue(
      classId,
      session.user.email,
      queueId,
      queueName
    );
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
