import {
  Account,
  ActiveEntry,
  ActiveQueue,
  Owner,
  ResolutionStatus,
  User,
} from "../types";
import { AccountModel } from "../models/account";
import mongoose from "mongoose";

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

// // resolve an entry
// const resolveEntry = (
//   user: User,
//   endpoint: string,
//   queueId: string,
//   resolutionStatus: ResolutionStatus
// ): void => {};

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

export default { getQueuesForStudent, getQueuesForTeacher, addActiveEntry };
