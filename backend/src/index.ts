/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response, NextFunction } from "express";
import config from "./config";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import classesRouter from "./controllers/classesController";
import teachersRouter from "./controllers/teachersController";
import queuesRouter from "./controllers/queuesController";

const app = express();
app.use(express.json());
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next();
}, cors({ maxAge: 84600 }));

// import { parseLoginPayload, parseString, parseUser } from "./utils";
import { parseLoginPayload } from "./utils/utils";
// import accountsService from "./services/accountsService";

const PORT = config.PORT;
const MONGODB_URI = config.DB_URL;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err.message}`);
  });

app.use("/api/teachers/:teacherSlug/classes/:classSlug/queues", queuesRouter);
app.use("/api/teachers/:teacherSlug/classes", classesRouter);
app.use("/api/teachers", teachersRouter);

// app.get("/api/archived", async (_req, res) => {
//   const results = await entriesService.getArchivedEntries();
//   res.send({
//     timestamp: new Date().toISOString(),
//     entries: results,
//   });
// });

app.post("/api/login", async (req, res) => {
  try {
    console.log(
      `login endpoint called with req.body: ${JSON.stringify(req.body)}`
    );
    const role = req.body.role;
    let clientId;
    if (role === "student") {
      clientId = config.GOOGLE_OAUTH_CLIENT_ID_STUDENT;
    } else {
      clientId = config.GOOGLE_OAUTH_CLIENT_ID_TEACHER;
    }

    const client = new OAuth2Client(clientId);
    console.log(`formed client with clientId: ${clientId}`);

    const ticket = await client.verifyIdToken({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      idToken: req.body.credential,
      audience: clientId,
    });
    console.log(`ticket: ${JSON.stringify(ticket)}`);

    const payload = ticket.getPayload();

    console.log(`payload: ${JSON.stringify(payload)}`);
    const userInfo = parseLoginPayload(payload);

    const sessionObject = {
      user: userInfo,
    };

    const token = jwt.sign(sessionObject, config.SECRET);

    return res.send({ ...sessionObject, token });
  } catch (error) {
    console.log(`error: ${JSON.stringify(error)}`);
    return res.status(500).json(error);
  }
});

// app.get("/api/account", async (req, res) => {
//   if (!req.headers.authorization) {
//     return res.status(400).send("token required in authorization header");
//   }
//   const token = req.headers.authorization.substring(7);

//   const userInfo = parseUser(jwt.verify(token, config.SECRET));

//   try {
//     const accountInfo = await accountsService.getAccountInfo(userInfo);
//     res.send(accountInfo);
//   } catch (error) {
//     console.log(`error: ${JSON.stringify(error)}`);
//     return res.status(500).json(error);
//   }
// });

// // add a new queue
// app.post("/api/account/queues", async (req, res) => {
//   if (!req.headers.authorization) {
//     return res.status(400).send("token required in authorization header");
//   }
//   const token = req.headers.authorization.substring(7);

//   const userInfo = parseUser(jwt.verify(token, config.SECRET));

//   if (!("queueName" in req.body) || !req.body.queueName) {
//     return res.status(400).send("queueName required in request body");
//   }

//   try {
//     const queueName = parseString(req.body.queueName);

//     const updatedAccountInfo = await accountsService.addQueue(
//       userInfo,
//       queueName
//     );

//     res.send(updatedAccountInfo);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// });

// // archive a queue
// app.post("/api/account/queues/archive", async (req, res) => {
//   if (!req.headers.authorization) {
//     return res.status(400).send("token required in authorization header");
//   }
//   const token = req.headers.authorization.substring(7);

//   const userInfo = parseUser(jwt.verify(token, config.SECRET));

//   if (!("queueName" in req.body) || !req.body.queueName) {
//     return res.status(400).send("queueName required in request body");
//   }

//   try {
//     const queueName = parseString(req.body.queueName);

//     const updatedInfo = await accountsService.archiveQueue(userInfo, queueName);
//     res.send(updatedInfo);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// });

// // unarchive aka reactivate aka activate a queue
// app.post("/api/account/queues/reactivate", async (req, res) => {
//   if (!req.headers.authorization) {
//     return res.status(400).send("token required in authorization header");
//   }
//   const token = req.headers.authorization.substring(7);

//   const userInfo = parseUser(jwt.verify(token, config.SECRET));

//   if (!("queueName" in req.body) || !req.body.queueName) {
//     return res.status(400).send("queueName required in request body");
//   }

//   try {
//     const queueName = parseString(req.body.queueName);

//     const updatedInfo = await accountsService.activateQueue(
//       userInfo,
//       queueName
//     );
//     res.send(updatedInfo);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// });

// // delete a queue
// app.post("/api/account/queues/delete", async (req, res) => {
//   if (!req.headers.authorization) {
//     return res.status(400).send("token required in authorization header");
//   }
//   const token = req.headers.authorization.substring(7);

//   const userInfo = parseUser(jwt.verify(token, config.SECRET));

//   if (!("queueName" in req.body) || !req.body.queueName) {
//     return res.status(400).send("queueName required in request body");
//   }

//   try {
//     const queueName = parseString(req.body.queueName);

//     const updatedInfo = await accountsService.deleteQueue(userInfo, queueName);
//     res.send(updatedInfo);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// });

app.get("/", (_req, res) => {
  res.send("welcome");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
