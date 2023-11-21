import {
  ActiveEntry,
  ActiveQueue,
  ResolutionStatus,
  User,
  ArchivedEntry,
} from "../types";
import { AccountModel } from "../models/account";
import mongoose from "mongoose";
import ArchivedModel from "../models/archived";

const getQueuesForStudent = async (
  endpoint: string
): Promise<ActiveQueue[]> => {
  const allData = await AccountModel.findOne({ "owner.endpoint": endpoint });
  if (!allData) {
    return [];
  }

  const returnData: ActiveQueue[] = allData.activeQueues;

  return returnData;
};

// get active entries
const getQueuesForTeacher = async (
  teacherEmail: string
): Promise<ActiveQueue[]> => {
  const allData = await AccountModel.findOne({ "owner.email": teacherEmail });
  if (!allData) {
    return [];
  }

  const returnData: ActiveQueue[] = allData.activeQueues;

  return returnData;
};

// add an entry
const addActiveEntry = async (
  user: User,
  endpoint: string,
  queueId: string
): Promise<void> => {
  const newEntry: ActiveEntry = {
    _id: new mongoose.Types.ObjectId(),
    timestamp: new Date().toISOString(),
    user: user,
  };
  await AccountModel.findOneAndUpdate(
    { "owner.endpoint": endpoint, "activeQueues._id": queueId },
    { $push: { "activeQueues.$.entries": newEntry } }
  );
};

// resolve an entry
const resolveEntry = async (
  user: User,
  endpoint: string,
  queueId: string,
  resolutionStatus: ResolutionStatus
): Promise<void> => {
  // pull it out of the array

  const queueContents = await AccountModel.findOneAndUpdate(
    { "owner.endpoint": endpoint, "activeQueues._id": queueId },
    { $pull: { "activeQueues.$.entries": { "user.email": user.email } } },
    { new: false, projection: { "activeQueues.$": 1 } }
  );

  // add it to the archived place
  const removedEntry = (queueContents as unknown as ActiveQueue).entries.find(
    (entry) => entry.user.email === user.email
  );

  if (!removedEntry) {
    throw new Error("could not find entry");
  }

  const { _id, ...entryData } = removedEntry;

  const resolution = {
    user,
    timestamp: new Date().toISOString(),
    status: resolutionStatus,
  };

  const archivedVersion: ArchivedEntry = {
    _id,
    request: entryData,
    resolution,
  };

  await ArchivedModel.insertMany([archivedVersion]);
};

// // add a queue
// const addQueue = (owner: Owner, queueName: string): void => {};

// // hide/show/rename/remove a queue
// const hideQueue = (owner: Owner, queueId: string): void => {};

// const showQueue = (owner: Owner, queueId: string): void => {};

// const renameQueue = (
//   owner: Owner,
//   queueId: string,
//   newName: string
// ): void => {};

// const deleteQueue = (owner: Owner, queueId: string): void => {};

export default {
  getQueuesForStudent,
  getQueuesForTeacher,
  addActiveEntry,
  resolveEntry,
};
