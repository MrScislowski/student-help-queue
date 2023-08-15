import { Types } from "mongoose";

export type ResolutionStatus = "cancel" | "resolve";

export interface ActiveEntry {
  _id: Types.ObjectId;
  requestor: User;
  requestTimestamp: string;
}

export type ActiveEntryStub = Omit<ActiveEntry, "_id" | "requestTimestamp">;

export interface ArchivedEntry extends ActiveEntry {
  resolver: User;
  resolveTimestamp: string;
  resolutionStatus: ResolutionStatus;
}

export type ArchivedEntryStub = Omit<
  ArchivedEntry,
  "_id" | "requestTimestamp" | "resolveTimestamp" | "requestor"
>;

export interface User {
  id: string;
  displayName: string;
}
