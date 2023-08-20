import { Types } from "mongoose";

export type ResolutionStatus = "cancel" | "resolve";

export interface ActiveEntry {
  _id: Types.ObjectId;
  request: {
    user: User;
    timestamp: string;
  };
}

export type ActiveEntryStub = Omit<ActiveEntry, "_id" | "request.timestamp">;

export interface ArchivedEntry extends ActiveEntry {
  resolution: {
    user: User;
    timestamp: string;
    status: ResolutionStatus;
  };
}

export type ArchivedEntryStub = Omit<
  ArchivedEntry,
  "_id" | "requestTimestamp" | "resolveTimestamp" | "requestor"
>;

export interface User {
  email: string;
  givenName: string;
  familyName: string;
}
