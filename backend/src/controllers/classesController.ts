/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, Request, Response, NextFunction } from "express";
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

      const ownsClass = classData.teacher.email === session.user.email;

      const queues: Queue[] = classData.queues.filter((queue) => {
        return queue.visible || ownsClass;
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

// TODO: Create a new queue for a class
router.post("/:classSlug/queues", async (req, res) => {
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

// // create a new queue for a class
// router.post("/:classId/queues", async (req, res) => {
//   try {
//     const classId = req.params.classId;
//     const queueName = parseString(req.body.queueName);

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const session: Session = res.locals.session;

//     await activeQueueService.addQueue(classId, session.user.email, queueName);
//     res.status(200).send();
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // delete a queue
// router.delete("/:classId/queues/:queueId", async (req, res) => {
//   try {
//     const classId = req.params.classId;
//     const queueId = req.params.queueId;

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const session: Session = res.locals.session;

//     await activeQueueService.deleteQueue(classId, session.user.email, queueId);
//     res.status(200).send();
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// // change visibility of a queue
// router.patch("/:classId/queues/:queueId", async (req, res) => {
//   try {
//     const classId = req.params.classId;
//     const queueId = req.params.queueId;
//     const visible = req.body.visible;

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const session: Session = res.locals.session;

//     await activeQueueService.changeVisibility(
//       classId,
//       session.user.email,
//       queueId,
//       visible
//     );
//     res.status(200).send();
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

export default router;
