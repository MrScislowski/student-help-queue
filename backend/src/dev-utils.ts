import mongoose from "mongoose";
import { AccountModel } from "./models/account";
import { Account, ActiveQueue, ActiveEntry, Owner } from "./types";
import config from "./config";

mongoose
  .connect(config.DB_URL)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err.message}`);
  });

async function createDBAccount(): Promise<void> {
  const accountUser1: Owner = {
    email: "mr.scislowski@gmail.com",
    familyName: "Scislowski",
    givenName: "Daniel",
    endpoint: "mrscislowski",
  };

  const accountUser2: Owner = {
    email: "dscislowski@usd266.com",
    familyName: "Scislowski",
    givenName: "Daniel",
    endpoint: "scislowski-usd266",
  };

  const newAccount1: Account = {
    activeQueues: [],
    archivedQueues: [],
    owner: accountUser1,
  };

  const newAccount2: Account = {
    activeQueues: [],
    archivedQueues: [],
    owner: accountUser2,
  };

  try {
    await AccountModel.deleteMany({});

    await AccountModel.insertMany([newAccount1, newAccount2]);
  } catch (err) {
    console.log(err);
  }

  const helpQueue: ActiveQueue = {
    _id: new mongoose.Types.ObjectId(),
    displayName: "help",
    visible: true,
    entries: [],
  };

  const completedQueue: ActiveQueue = {
    _id: new mongoose.Types.ObjectId(),
    displayName: "completed",
    visible: true,
    entries: [],
  };

  try {
    const activeAccount = await AccountModel.findOne({
      "owner.email": "mr.scislowski@gmail.com",
    });

    if (!activeAccount) {
      throw new Error("account not found");
    }
    activeAccount.activeQueues.push(helpQueue, completedQueue);

    await activeAccount.save();

    for (let count = 0; count < 5; count++) {
      const entry: ActiveEntry = {
        timestamp: new Date(
          Date.now() - Math.random() * 20 * 60 * 1000
        ).toISOString(),
        user: {
          email: `${Math.random().toString(36).substr(2, 5)}@gmail.com`,
          familyName: Math.random().toString(36).substr(2, 5),
          givenName: Math.random().toString(36).substr(2, 5),
        },
      };
      activeAccount.activeQueues
        .find((q) => q._id === helpQueue._id)
        ?.entries.push(entry);
      await activeAccount.save();
    }
  } catch (err) {
    console.log("Error: ", err);
  }
}

createDBAccount()
  .then(() => console.log("db filled"))
  .then(() => mongoose.connection.close())
  .then(() => console.log("goodbye"))
  .catch(() => console.log("error occured shutting down"));
