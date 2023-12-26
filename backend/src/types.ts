import { Types } from "mongoose";

export type ResolutionStatus = "cancel" | "resolve";

export interface ActiveEntry {
  user: User;
  timestamp: string;
}

export interface ArchivedEntry {
  _id: Types.ObjectId;
  request: ActiveEntry;
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

export interface Owner {
  email: string;
  givenName: string;
  familyName: string;
  endpoint: string;
}

export interface Session {
  user: User;
}

export interface Account {
  owner: Owner;
  activeQueues: ActiveQueue[];
  archivedQueues: Types.ObjectId[];
}

export interface ActiveQueue {
  _id: Types.ObjectId;
  displayName: string;
  visible: boolean;
  entries: ActiveEntry[];
}

export interface Teacher {
  _id: Types.ObjectId;
  email: string;
  username: string;
  classes: Types.ObjectId[];
}

export interface Class {
  _id: Types.ObjectId;
  className: string;
  teacherId: Types.ObjectId;
  teacherEmail: string;
  queues: Queue[];
}

export interface Queue {
  _id: Types.ObjectId;
  displayName: string;
  visible: boolean;
  entries: ActiveEntry[];
}

export interface Entry {
  timeAdded: string;
  user: User;
}
