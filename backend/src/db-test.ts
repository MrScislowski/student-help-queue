import mongoose from "mongoose";
import { AccountModel } from "./models/account";
// import { Account, User, ActiveQueue, ActiveEntry } from "./types";
import config from "./config";

mongoose
  .connect(config.DB_URL)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err.message}`);
  });

/*
MONGOOSE:
AccountModel.findOne(
  { "user.email": "dscislowski@usd266.com" },
  { "activeQueues.displayName": 1 }
)
*/

AccountModel.findOne(
  { "user.email": "dscislowski@usd266.com" },
  { "activeQueues.displayName": 1 }
)
  .then((data) => console.log(data))
  .catch((_err) => console.log("an error occurred"));
