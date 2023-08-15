import mongoose from "mongoose";
import { ActiveEntry } from "../types";

const schema = new mongoose.Schema<ActiveEntry>({
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
});

export default mongoose.model<ActiveEntry>("Active", schema);
