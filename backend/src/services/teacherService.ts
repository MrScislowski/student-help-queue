import { TeacherModel } from "../models/teacher";
import { Teacher, TeacherBase } from "../types";
import { handleDatabaseError } from "../utils/errorHandlers";
import adminService from "./adminService";

const createNewAccount = async (
  creatorEmail: string,
  proposedTeacher: Omit<Teacher, "_id">
) => {
  // check that person is admin
  if (!adminService.isAdmin(creatorEmail)) {
    throw new Error(
      "You are not an administrator, so you cannot create new accounts"
    );
  }

  // create new teacher account (schema checks uniqueness automatically)
  const newTeacher = new TeacherModel({
    email: proposedTeacher.email,
    slug: proposedTeacher.slug,
    classes: [],
  });
  try {
    await newTeacher.save();
  } catch (err) {
    handleDatabaseError(err);
  }
  return newTeacher;
};

const listTeachers = async (requestorEmail: string): Promise<TeacherBase[]> => {
  if (!adminService.isAdmin(requestorEmail)) {
    throw new Error(
      "You are not an administrator, so you cannot see teacher accounts"
    );
  }

  const teachers = await TeacherModel.find({});
  if (!teachers) {
    throw new Error("No teachers found");
  }

  return teachers;
};

const getTeacherBySlug = async (
  requestorEmail: string,
  slug: string
): Promise<Teacher> => {
  const teacher = await TeacherModel.findOne({ slug: slug }).populate(
    "classes"
  );
  if (!teacher) {
    throw new Error("No teacher found with that slug");
  }

  if (requestorEmail !== teacher.email) {
    throw new Error("You are not authorized to view this teacher's account");
  }
  return teacher as unknown as Teacher;
};

export default {
  createNewAccount,
  listTeachers,
  getTeacherBySlug,
};
