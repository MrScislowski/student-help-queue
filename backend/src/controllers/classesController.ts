/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, Request, Response } from "express";
import { Queue, Session } from "../types";
import classService from "../services/classService";
import { authenticateToken } from "../middlewares/authMiddleware";

// router is using baseUrl /api/teachers/:teacherSlug/classes
interface RequestWithTeacherSlug extends Request {
  params: {
    teacherSlug: string;
    classSlug: string;
  };
}

const router = Router({ mergeParams: true });
router.use(authenticateToken);

// Get all queues for a class
router.get(
  "/:classSlug/queues",
  async (req: RequestWithTeacherSlug, res: Response) => {
    const teacherSlug = req.params.teacherSlug;
    const classSlug = req.params.classSlug;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const session: Session = res.locals.session;

      const classData = await classService.getClassData(teacherSlug, classSlug);

      if (classData === null) {
        return res.status(404).send({
          error: `Class ${classSlug} with teacher ${teacherSlug} not found`,
        });
      }

      const queues: Queue[] = classData.queues.filter((queue) => {
        return queue.visible || session.role === "teacher";
      });

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
  }
);

interface CreateNewQueueRequest extends Request {
  params: {
    classSlug: string;
  };

  body: {
    queueName: string;
  };
}

// Create a new queue for a class
router.post("/:classSlug/queues", async (req: CreateNewQueueRequest, res) => {
  try {
    const classSlug = req.params.classSlug;
    const queueName = req.body.queueName;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    await classService.addQueue(session.user.email, classSlug, queueName);
    res.status(200).send();
  } catch (err) {
    res.status(400).send(JSON.stringify(err));
  }
});

interface CreateNewClassRequest extends Request {
  params: {
    teacherSlug: string;
  };

  body: {
    classSlug: string;
  };
}

// Create a new class
router.post("/", async (req: CreateNewClassRequest, res: Response) => {
  const teacherSlug = req.params.teacherSlug;
  const classSlug = req.body.classSlug;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    await classService.createNewClass(
      session.user.email,
      teacherSlug,
      classSlug
    );
    res.status(200).send();
  } catch (err) {
    res.status(400).send(JSON.stringify(err));
  }
});

export default router;
