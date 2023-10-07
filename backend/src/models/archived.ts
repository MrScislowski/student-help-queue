import mongoose from "mongoose";
import { ArchivedEntry } from "../types";
import { userSchema } from "./active";

const schema = new mongoose.Schema<ArchivedEntry>({
  request: {
    user: {
      type: userSchema,
      required: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
  },
  resolution: {
    user: {
      type: userSchema,
      required: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["cancel", "resolve"],
      required: true,
    },
  },
  queueName: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ArchivedEntry>("Archived", schema);
