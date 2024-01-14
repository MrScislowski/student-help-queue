/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router, Request, Response } from "express";
import { handleError } from "../utils/errorHandlers";
import { Session, Teacher } from "../types";
import teacherService from "../services/teacherService";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateToken);

interface CreateNewTeacherRequest extends Request {
  body: {
    email: string;
    slug: string;
  };
}

// Create a new teacher account
router.post("/", async (req: CreateNewTeacherRequest, res: Response) => {
  const email = req.body.email;
  const slug = req.body.slug;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    const proposedTeacher: Omit<Teacher, "_id"> = {
      email: email,
      slug: slug,
      classes: [],
    };

    const createdTeacher = await teacherService.createNewAccount(
      session.user.email,
      proposedTeacher
    );

    res.send(createdTeacher);
  } catch (error: unknown) {
    handleError(error, res);
  }
});

// List teachers
router.get("/", async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    const teachers = await teacherService.listTeachers(session.user.email);
    res.send(teachers);
  } catch (error: unknown) {
    handleError(error, res);
  }
});

// Get teacher by slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session: Session = res.locals.session;

    const teacher = await teacherService.getTeacherBySlug(
      session.user.email,
      req.params.slug
    );

    res.send(teacher);
  } catch (error: unknown) {
    handleError(error, res);
  }
});

export default router;
