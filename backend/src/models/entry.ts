import mongoose from "mongoose";
import { Entry } from "../types";
import { userSchema } from "./user";

const entrySchema = new mongoose.Schema<Entry>({
  timeAdded: {
    type: String,
    required: true,
  },

  user: {
    type: userSchema,
    required: true,
  },
});

export { entrySchema };
