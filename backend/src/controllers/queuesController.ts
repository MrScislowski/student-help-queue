import { Router, Request, Response, NextFunction } from "express";
import classService from "../services/classService";
import { Session } from "../types";

const router = Router({ mergeParams: true });

interface RequestWithTeacherAndClassSlug extends Request {
  params: {
    teacherSlug: string;
    classSlug: string;
    queueId: string;
  };
}

// TODO: Delete a queue
// DELETE	/teachers/:teacherSlug/classes/:classSlug/queues/:queueId
router.delete("/:queueId", async (req: RequestWithTeacherAndClassSlug, res) => {
  try {
    const classSlug = req.params.classSlug;
    const queueId = req.params.queueId;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    classService.deleteQueue(session.user.email, classSlug, queueId);
  } catch (error: unknown) {
    let message = "";
    if (error instanceof Error) {
      message += error.message;
    }
    return res.status(500).send({ error: message });
  }
});

// TODO: Change visibility of a queue

// TODO: Rename a queue

// TODO: Add a user to a queue

// TODO: Remove a user from a queue

export default router;
