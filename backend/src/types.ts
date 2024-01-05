import { Types } from "mongoose";

export type ResolutionStatus = "cancel" | "resolve";
export type Role = "teacher" | "student" | "admin";

export interface User {
  email: string;
  givenName: string;
  familyName: string;
}

export interface Session {
  user: User;
  role: Role;
}

export interface TeacherBase {
  _id: Types.ObjectId;
  email: string;
  slug: string;
  classes: Types.ObjectId[];
}

export interface Teacher extends Omit<TeacherBase, "classes"> {
  classes: Class[];
}

export interface ClassBase {
  _id: Types.ObjectId;
  classSlug: string;
  teacher: Types.ObjectId;
  queues: Queue[];
}

export interface Class extends Omit<ClassBase, "teacher"> {
  teacher: Teacher;
}

export interface Queue {
  _id: Types.ObjectId;
  displayName: string;
  visible: boolean;
  entries: Entry[];
}

export interface Entry {
  timeAdded: string;
  user: User;
}
