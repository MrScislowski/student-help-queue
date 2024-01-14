/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router, Request } from "express";
import classService from "../services/classService";
import { Session } from "../types";
import { authenticateToken } from "../middlewares/authMiddleware";
import { parseResolutionStatus } from "../utils/utils";

const router = Router({ mergeParams: true });

router.use(authenticateToken);

interface DeleteQueueRequest extends Request {
  params: {
    teacherSlug: string;
    classSlug: string;
    queueId: string;
  };
}

// Delete a queue
// DELETE	/teachers/:teacherSlug/classes/:classSlug/queues/:queueId
router.delete("/:queueId", async (req: DeleteQueueRequest, res) => {
  try {
    const classSlug = req.params.classSlug;
    const queueId = req.params.queueId;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    await classService.deleteQueue(session.user.email, classSlug, queueId);
    return res.status(204).send();
  } catch (error: unknown) {
    let message = "";
    if (error instanceof Error) {
      message += error.message;
    }
    return res.status(500).send({ error: message });
  }
});

interface ChangeVisibilityRequest extends Request {
  params: {
    classSlug: string;
    queueId: string;
  };
  body: {
    visible?: boolean;
    queueName?: string;
  };
}

// Change visibility  of a queue {visible: true/false}
// Or rename a queue {queueName: newName}
// PATCH	/teachers/:teacherSlug/classes/:classSlug/queues/:queueId
router.patch("/:queueId", async (req: ChangeVisibilityRequest, res) => {
  try {
    const classSlug = req.params.classSlug;
    const queueId = req.params.queueId;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    if (req.body.visible !== undefined) {
      await classService.setVisibility(
        session.user.email,
        classSlug,
        queueId,
        req.body.visible
      );
    }

    if (req.body.queueName !== undefined) {
      await classService.renameQueue(
        session.user.email,
        classSlug,
        queueId,
        req.body.queueName
      );
    }
    return res.status(204).send();
  } catch (error: unknown) {
    let message = "";
    if (error instanceof Error) {
      message += error.message;
    }
    return res.status(500).send({ error: message });
  }
});

// Add a user to a queue
router.post("/:queueId/users", async (req: DeleteQueueRequest, res) => {
  try {
    const classSlug = req.params.classSlug;
    const queueId = req.params.queueId;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    await classService.addUserToQueue(
      classSlug,
      queueId,
      session.user,
      session.user
    );
    return res.status(204).send();
  } catch (error: unknown) {
    let message = "";
    if (error instanceof Error) {
      message += error.message;
    }
    return res.status(500).send({ error: message });
  }
});

interface RemoveUserRequest extends Request {
  params: {
    classSlug: string;
    queueId: string;
  };
  body: {
    email?: string;
    resolutionStatus: string;
  };
}

//  Remove a user from a queue
router.delete("/:queueId/users", async (req: RemoveUserRequest, res) => {
  try {
    const classSlug = req.params.classSlug;
    const queueId = req.params.queueId;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    let userToRemove = session.user;

    if (!req.body.resolutionStatus) {
      throw new Error("resolutionStatus is required");
    }

    const resolutionStatus = parseResolutionStatus(req.body.resolutionStatus);

    if (req.body.email) {
      userToRemove = {
        email: req.body.email,
        givenName: "unknown",
        familyName: "unknown",
      };
    }

    await classService.removeUserFromQueue(
      classSlug,
      queueId,
      userToRemove,
      session.user,
      resolutionStatus
    );
    return res.status(204).send();
  } catch (error: unknown) {
    let message = "";
    if (error instanceof Error) {
      message += error.message;
    }
    return res.status(500).send({ error: message });
  }
});

export default router;
