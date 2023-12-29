import { TeacherModel } from "../models/teacher";
import { Teacher } from "../types";
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

const listTeachers = async (requestorEmail: string) => {
  if (!adminService.isAdmin(requestorEmail)) {
    throw new Error(
      "You are not an administrator, so you cannot see teacher accounts"
    );
  }

  const teachers = await TeacherModel.find({});
  return teachers;
}

export default {
  createNewAccount,
  listTeachers,
};
