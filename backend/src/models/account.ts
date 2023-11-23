import mongoose from "mongoose";

import { Account, ActiveQueue } from "../types";
import { activeEntrySchema } from "./active";
import { ownerSchema } from "./owner";

const activeQueueSchema = new mongoose.Schema<ActiveQueue>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  displayName: {
    type: String,
    required: true,
  },

  visible: {
    type: Boolean,
    required: true,
  },

  entries: [activeEntrySchema],
});

const accountSchema = new mongoose.Schema<Account>({
  owner: {
    type: ownerSchema,
    required: true,
  },
  activeQueues: {
    type: [activeQueueSchema],
    required: true,
  },
  archivedQueues: {
    type: [mongoose.Types.ObjectId],
    required: true,
  },
});

const AccountModel = mongoose.model<Account>("Account", accountSchema);

export { AccountModel };
