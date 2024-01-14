import mongoose from "mongoose";

import { TeacherBase } from "../types";

const teacherSchema = new mongoose.Schema<TeacherBase>({
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

  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
});

const TeacherModel = mongoose.model<TeacherBase>("Teacher", teacherSchema);

export { TeacherModel, teacherSchema };
