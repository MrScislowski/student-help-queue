import mongoose from "mongoose";
import { Account } from "../types";
import { userSchema } from "./active";

const schema = new mongoose.Schema<Account>({
  user: {
    type: userSchema,
    required: true,
  },
  activeQueues: {
    type: [String],
    required: true,
  },
  archivedQueues: {
    type: [String],
    required: true,
  },
});

const AccountModel = mongoose.model<Account>("Account", schema);

export { AccountModel };
