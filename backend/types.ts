import { Types } from "mongoose";

export type ResolutionStatus = "cancel" | "resolve";

export interface ActiveEntry {
  _id: Types.ObjectId;
  requestorId: string;
  requestorDisplayName: string;
  requestTimestamp: string;
}

export interface ArchivedEntry extends ActiveEntry {
  resolverId: string;
  resolverDisplayName: string;
  resolvedTimestamp: string;
  resolutionStatus: ResolutionStatus;
}
