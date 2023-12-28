import { Router, Request, Response, NextFunction } from "express";
import { handleDatabaseError } from "../utils/errorHandlers";
import { Session, Teacher } from "../types";
import teacherService from "../services/teacherService";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateToken);

// TODO: Create a new teacher account
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
    handleDatabaseError(error);
  }
});

export default router;
