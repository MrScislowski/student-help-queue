import mongoose from "mongoose";
import { ArchivedEntry } from "../types";

const schema = new mongoose.Schema<ArchivedEntry>({
  request: {
    user: {
      email: {
        type: String,
        required: true,
      },
      givenName: {
        type: String,
        required: true,
      },
      familyName: {
        type: String,
        required: true,
      },
    },
    timestamp: {
      type: String,
      required: true,
    },
  },
  resolution: {
    user: {
      email: {
        type: String,
        required: true,
      },
      givenName: {
        type: String,
        required: true,
      },
      familyName: {
        type: String,
        required: true,
      },
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
  queue: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ArchivedEntry>("Archived", schema);
