// /* eslint-disable @typescript-eslint/no-misused-promises */
// import { Router } from "express";
// import { Session } from "../types";
// import { ActiveEntry } from "../types";
// import jwt from "jsonwebtoken";
// import { parseArchivedEntry, parseString, parseSession } from "../utils";
// import entriesService from "../services/entriesService";
// import config from "../config";

// const router = Router();

// router.use((req, res, next) => {
//   if (!req.headers.authorization) {
//     return res.status(400).send("token required in authorization header");
//   }
//   const token = req.headers.authorization.substring(7);

//   const sessionInfo = parseSession(jwt.verify(token, config.SECRET));

//   // this seemed too intense: https://stackoverflow.com/questions/55362741/overwrite-any-in-typescript-when-merging-interfaces
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   res.locals.session = sessionInfo;
//   next();
// });

// router.get("/", async (req, res) => {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const session: Session = res.locals.session;

//   const results: Omit<ActiveEntry, "_id">[] =
//     await entriesService.getActiveEntries(session);
//   res.send({
//     timestamp: new Date().toISOString(),
//     entries: results,
//   });
// });

// router.post("/", async (req, res) => {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const session: Session = res.locals.session;

//   try {
//     if (!("queueName" in req.body) || !req.body.queueName) {
//       throw new Error("queueName not specified");
//     }
//     const queueName = parseString(req.body.queueName);
//     const newEntry = await entriesService.addActiveEntry(session, queueName);

//     res.send({
//       timestamp: new Date().toISOString(),
//       entry: newEntry,
//     });
//   } catch (error: unknown) {
//     let errorMessage = "Error occurred. ";
//     if (error instanceof Error) {
//       errorMessage += error.message;
//     }
//     res.status(400).send(errorMessage);
//   }
// });

// router.post("/:id", async (req, res) => {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//   const session: Session = res.locals.session;

//   const entryId = req.params.id;

//   try {
//     const resolutionData = parseArchivedEntry(req.body);
//     const archivedVersion = await entriesService.resolveActiveEntry(
//       entryId,
//       session,
//       resolutionData
//     );
//     return res.send({
//       timestamp: new Date().toISOString(),
//       entry: archivedVersion,
//     });
//   } catch (e: unknown) {
//     let errorMessage = "Error occurred. ";
//     if (e instanceof Error) {
//       errorMessage += e.message;
//     }
//     return res.status(400).send(errorMessage);
//   }
// });

// export default router;
