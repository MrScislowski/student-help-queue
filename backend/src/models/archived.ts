import mongoose from "mongoose";
import { ArchivedEntry } from "../types";

const schema = new mongoose.Schema<ArchivedEntry>({
  requestor: {
    id: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
  },
  requestTimestamp: {
    type: String,
    required: true,
  },
  resolver: {
    id: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
  },
  resolveTimestamp: {
    type: String,
    required: true,
  },
  resolutionStatus: {
    type: String,
    enum: ["cancel", "resolve"],
    required: true,
  },
});

export default mongoose.model<ArchivedEntry>("Archived", schema);
