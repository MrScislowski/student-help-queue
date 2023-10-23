import mongoose from "mongoose";
import { ArchivedEntry } from "../types";
import { activeEntrySchema, userSchema } from "./active";

const schema = new mongoose.Schema<ArchivedEntry>({
  request: activeEntrySchema,
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
});

export default mongoose.model<ArchivedEntry>("Archived", schema);
