/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { Session } from "../types";
import { parseSession } from "../utils";
import jwt from "jsonwebtoken";
import config from "../config";
import accountsService from "../services/accountsService";

const router = Router();

router.use((req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(400).send("token required in authorization header");
  }
  const token = req.headers.authorization.substring(7);

  const sessionInfo = parseSession(jwt.verify(token, config.SECRET));

  // this seemed too intense: https://stackoverflow.com/questions/55362741/overwrite-any-in-typescript-when-merging-interfaces
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  res.locals.session = sessionInfo;
  next();
});

router.get("/active", async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const session: Session = res.locals.session;

  try {
    const accountInfo = await accountsService.getAccountInfo(
      session.selectedClass.teacherEmail
    );
    res.send(accountInfo.activeQueues);
  } catch (error) {
    console.log(`error: ${JSON.stringify(error)}`);
    return res.status(500).json(error);
  }
});

export default router;
