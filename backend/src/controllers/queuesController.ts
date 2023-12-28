import { Router, Request, Response, NextFunction } from "express";
import classService from "../services/classService";
import { Session } from "../types";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router({ mergeParams: true });

router.use(authenticateToken);

interface RequestWithTeacherAndClassSlug extends Request {
  params: {
    teacherSlug: string;
    classSlug: string;
    queueId: string;
  };
}

// Delete a queue
// DELETE	/teachers/:teacherSlug/classes/:classSlug/queues/:queueId
router.delete("/:queueId", async (req: RequestWithTeacherAndClassSlug, res) => {
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

// Change visibility  of a queue {visible: true/false}
// Or rename a queue {queueName: newName}
// PATCH	/teachers/:teacherSlug/classes/:classSlug/queues/:queueId
router.patch("/:queueId", async (req: RequestWithTeacherAndClassSlug, res) => {
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

// TODO: Add a user to a queue
router.post(
  "/:queueId/users",
  async (req: RequestWithTeacherAndClassSlug, res) => {
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
  }
);

// TODO: Remove a user from a queue

export default router;
