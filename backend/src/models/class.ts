import mongoose from "mongoose";
import { ClassBase } from "../types";
import { queueSchema } from "./queue";

const classSchema = new mongoose.Schema<ClassBase>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  classSlug: {
    type: String,
    required: true,
  },

  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  queues: [queueSchema],
});

const ClassModel = mongoose.model<ClassBase>("Class", classSchema);

export { classSchema, ClassModel };
