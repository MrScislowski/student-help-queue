import mongoose from "mongoose";
import { ActiveEntry } from "../types";

const schema = new mongoose.Schema<ActiveEntry>({
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
  queueName: {
    type: String,
    required: true,
  },
});

const ActiveModel = mongoose.model<ActiveEntry>("Active", schema);

export { ActiveModel as Active };
