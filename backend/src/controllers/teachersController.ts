import { Router, Request, Response, NextFunction } from "express";
import { handleDatabaseError } from "../utils/errorHandlers";
import { Session, Teacher } from "../types";
import teacherService from "../services/teacherService";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateToken);

// Create a new teacher account
router.post("/", async (req: Request, res: Response) => {
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
    let message = "";
    if (error instanceof Error) {
      message += error.message;
    }
    return res.status(500).send({ error: message });
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
    handleDatabaseError(error);
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
    handleDatabaseError(error);
  }
});

export default router;
