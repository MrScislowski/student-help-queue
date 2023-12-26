import mongoose from "mongoose";

import { Teacher } from "../types";

const teacherSchema = new mongoose.Schema<Teacher>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  classes: [mongoose.Schema.Types.ObjectId],
});

const TeacherModel = mongoose.model<Teacher>("Teacher", teacherSchema);

export { TeacherModel, teacherSchema };
