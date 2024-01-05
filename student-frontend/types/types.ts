export type ResolutionStatus = "cancel" | "resolve";
type Role = "student" | "teacher";

export interface ActiveEntry {
  user: User;
  timeAdded: string;
}

export interface Queue {
  _id: string;
  displayName: string;
  entries: ActiveEntry[];
  visible: boolean;
}

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
  _id: string;
  email: string;
  slug: string;
  classes: string[];
}

export interface Teacher extends Omit<TeacherBase, "classes"> {
  classes: Class[];
}

export interface ClassBase {
  _id: string;
  classSlug: string;
  teacher: string;
  queues: Queue[];
}

export interface Class extends Omit<ClassBase, "teacher"> {
  teacher: Teacher;
}
