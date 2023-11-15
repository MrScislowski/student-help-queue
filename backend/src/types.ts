import { Types } from "mongoose";

export type ResolutionStatus = "cancel" | "resolve";

export interface ActiveEntry {
  _id: Types.ObjectId;
  user: User;
  timestamp: string;
}

export type ActiveEntryStub = Omit<ActiveEntry, "_id" | "request.timestamp">;

export interface ArchivedEntry {
  _id: Types.ObjectId;
  request: Omit<ActiveEntry, "_id">;
  resolution: {
    user: User;
    timestamp: string;
    status: ResolutionStatus;
  };
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

export interface Account {
  user: User;
  activeQueues: ActiveQueue[];
  archivedQueues: Types.ObjectId[];
}

export interface ActiveQueue {
  _id: Types.ObjectId;
  displayName: string;
  visible: boolean;
  entries: ActiveEntry[];
}
