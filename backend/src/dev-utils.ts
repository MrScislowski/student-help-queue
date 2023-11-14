import mongoose from "mongoose";
import { AccountModel } from "./models/account";
import { Account, User } from "./types";
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
}

createDBAccount()
  .then(() => console.log("db filled"))
  .catch(() => console.log("error filling db"));
