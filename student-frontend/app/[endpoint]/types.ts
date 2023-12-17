export type ResolutionStatus = "cancel" | "resolve";

export interface ActiveEntry {
  user: User;
  timestamp: string;
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
  selectedClass: {
    name: string;
    teacherEmail: string;
  };
  token: string;
}
