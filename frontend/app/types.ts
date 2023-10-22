export type ResolutionStatus = "cancel" | "resolve";

export interface ActiveEntry {
  _id: string;
  request: {
    user: User;
    timestamp: string;
  };
  queueName: string;
}

export interface User {
  email: string;
  givenName: string;
  familyName: string;
}

export interface Session {
  user: User;
  selectedClass: {
    name: string;
    teacherEmail: string;
  };
}

export const emptySession = {
  user: { email: "emptyuser", givenName: "empty", familyName: "user" },
  selectedClass: {
    name: "noclass",
    teacherEmail: "noteacher",
  },
};
