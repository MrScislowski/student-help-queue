import { Session, User } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isUser = (obj: unknown): obj is User => {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  if (
    !(
      "email" in obj &&
      isString(obj.email) &&
      "givenName" in obj &&
      isString(obj.givenName) &&
      "familyName" in obj &&
      isString(obj.familyName)
    )
  ) {
    return false;
  }

  return true;
};

export const isSession = (obj: unknown): obj is Session => {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  if (!("user" in obj && isUser(obj.user))) {
    return false;
  }

  if (
    !(
      "selectedClass" in obj &&
      obj.selectedClass &&
      typeof obj.selectedClass === "object"
    )
  ) {
    return false;
  }
  const theClass = obj.selectedClass;

  if (
    !(
      "name" in theClass &&
      theClass.name &&
      isString(theClass.name) &&
      "teacherEmail" in theClass &&
      theClass.teacherEmail &&
      isString(theClass.teacherEmail)
    )
  ) {
    return false;
  }

  if (!("token" in obj && obj.token && isString(obj.token))) {
    return false;
  }

  return true;
};
