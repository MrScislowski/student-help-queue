import mongoose from "mongoose";
import { Queue } from "../types";
import { entrySchema } from "./entry";

const queueSchema = new mongoose.Schema<Queue>({
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

  entries: {
    type: [entrySchema],
    required: true,
  },
});

export { queueSchema };
