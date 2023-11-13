import mongoose from "mongoose";
import { Queue } from "../types";

const schema = new mongoose.Schema<Queue>({
  displayName: {
    type: String,
    required: true,
  },

  visible: {
    type: Boolean,
    required: true,
  }
});

export { schema as queueSchema};
