import mongoose from "mongoose";

import { Teacher } from "../types";

const teacherSchema = new mongoose.Schema<Teacher>({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  slug: {
    type: String,
    required: true,
    unique: true,
  },

  classes: [mongoose.Schema.Types.ObjectId],
});

const TeacherModel = mongoose.model<Teacher>("Teacher", teacherSchema);

export { TeacherModel, teacherSchema };
