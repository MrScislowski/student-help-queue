import mongoose from "mongoose";
import { Class } from "../types";
import { queueSchema } from "./queue";

const classSchema = new mongoose.Schema<Class>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
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
