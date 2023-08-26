/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response, NextFunction } from "express";
import config from "./config";
import cors from "cors";

const app = express();
app.use(express.json());
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next();
}, cors({ maxAge: 84600 }));

const PORT = config.PORT;

app.get("/", (_req, res) => {
  res.send("welcome");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
