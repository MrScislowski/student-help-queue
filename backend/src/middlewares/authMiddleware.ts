import { Request, Response, NextFunction } from "express";
import { Session } from "../types";
import config from "../config";
import { parseSession } from "../utils/utils";
import jwt from "jsonwebtoken";

const mockSession: Session = {
  user: {
    email: "mr.scislowski@gmail.com",
    familyName: "Daniel",
    givenName: "Scislowski",
  },
};

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  let sessionInfo;

  if (config.DISABLE_AUTH) {
    sessionInfo = mockSession;
  } else {
    if (!req.headers.authorization) {
      return res.status(400).send("Token required in authorization header");
    }

    const token = req.headers.authorization.substring(7);
    sessionInfo = parseSession(jwt.verify(token, config.SECRET));
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  res.locals.session = sessionInfo;
  next();
};

export { authenticateToken };
