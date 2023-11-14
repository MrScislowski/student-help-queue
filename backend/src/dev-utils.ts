import mongoose from "mongoose";
import { AccountModel } from "./models/account";
import { Account, User, Queue } from "./types";
import config from "./config";
import { QueueModel } from "./models/queue";

mongoose
  .connect(config.DB_URL)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err.message}`);
  });

async function createDBAccount(): Promise<void> {
  const accountUser1: User = {
    email: "mr.scislowski@gmail.com",
    familyName: "Scislowski",
    givenName: "Daniel",
  };

  const accountUser2: User = {
    email: "dscislowski@usd266.com",
    familyName: "Scislowski",
    givenName: "Daniel",
  };

  const newAccount1: Account = {
    activeQueues: [],
    archivedQueues: [],
    user: accountUser1,
  };

  const newAccount2: Account = {
    activeQueues: [],
    archivedQueues: [],
    user: accountUser2,
  };

  try {
    await AccountModel.deleteMany({});

    await AccountModel.insertMany([newAccount1, newAccount2]);
  } catch (err) {
    console.log(err);
  }

  const helpQueue: Queue = {
    displayName: "help",
    visible: true,
  }

  const completedQueue: Queue = {
    displayName: "completed",
    visible: true,
  }

  try {
    const queues = await QueueModel.insertMany({
      helpQueue, completedQueue,
    })

    const activeAccount = await AccountModel.findOne({"user.email": "dscislowski@usd266.com"});

    if (!activeAccount) {
      throw new Error("account not found");
    }

    queues.forEach(q => activeAccount.activeQueues.push()
  }
}

createDBAccount()
  .then(() => console.log("db filled"))
  .catch(() => console.log("error filling db"));
