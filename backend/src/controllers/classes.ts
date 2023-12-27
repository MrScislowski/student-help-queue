/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, Request, Response, NextFunction } from "express";
import { Session } from "../types";
import activeQueueService from "../services/classService";
import { authenticateToken } from "../middlewares/authMiddleware";

// router is using baseUrl /api/teachers/:teacherId/classes
interface RequestWithTeacherId extends Request {
  params: {
    teacherId: string;
    classId: string;
  };
}

const router = Router();
router.use(authenticateToken);

// Get all queues for a class
router.get("/:classId/queues", async (req: RequestWithTeacherId, res) => {
  const teacherId = req.params.teacherId;
  const classId = req.params.classId;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    const queues = await activeQueueService.getClassData(teacherId, classId);

    if (queues === null) {
      return res.status(404).send({ error: `Class ${classId} not found` });
    }

    // TODO: when the database model is refactored, only return non
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
