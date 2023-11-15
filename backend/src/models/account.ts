import mongoose, { Types } from "mongoose";

import { Account, ActiveQueue } from "../types";
import { userSchema, activeEntrySchema } from "./active";

const activeQueueSchema = new mongoose.Schema<ActiveQueue>({
  displayName: {
    type: String,
    required: true,
  },

  visible: {
    type: Boolean,
    required: true,
  },

  entries: {
    type: [activeEntrySchema],
    required: true,
  },
});

const schema = new mongoose.Schema<Account>({
  user: {
    type: userSchema,
    required: true,
  },
  activeQueues: {
    type: [activeQueueSchema],
    required: true,
  },
  archivedQueues: {
    type: [Types.ObjectId],
    required: true,
  },
});

const AccountModel = mongoose.model<Account>("Account", schema);

export { AccountModel };
