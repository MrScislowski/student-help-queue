import mongoose from "mongoose";
import { Class } from "../types";
import { queueSchema } from "./queue";

const classSchema = new mongoose.Schema<Class>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  classEndpoint: {
    type: String,
    required: true,
  },

  className: {
    type: String,
    required: true,
  },

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  teacherEmail: {
    type: String,
    required: true,
  },

  queues: [queueSchema],
});

const ClassModel = mongoose.model<Class>("Class", classSchema);

export { classSchema, ClassModel };
