import { ActiveEntry, ActiveQueue, ResolutionStatus, User } from "../types";
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
    timestamp: new Date().toISOString(),
    user: user,
  };

  await AccountModel.findOneAndUpdate(
    {
      "owner.endpoint": endpoint,
      "activeQueues._id": queueId,
      "activeQueues.$.entries": {
        $not: {
          $elemMatch: {
            "user.email": user.email,
          },
        },
      },
    },
    {
      $push: {
        "activeQueues.$.entries": newEntry,
      },
    }
  );
};

// resolve an entry belonging to me
const resolveMyEntry = async (
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

  if (
    !queueContents ||
    !queueContents.activeQueues ||
    queueContents.activeQueues.length === 0
  ) {
    throw new Error("could not find queue");
  }
  // add it to the archived place
  const removedEntry = (
    queueContents.activeQueues as unknown as ActiveQueue[]
  )[0].entries.find((entry) => entry.user.email === user.email);

  if (!removedEntry) {
    throw new Error("could not find entry");
  }

  const resolution = {
    user,
    timestamp: new Date().toISOString(),
    status: resolutionStatus,
  };

  const archivedVersion = new ArchivedModel({
    _id: new mongoose.Types.ObjectId(),
    request: removedEntry,
    resolution,
  });

  await archivedVersion.save();
};

// resolve an entry belonging to someone else
const resolveOthersEntry = async (
  user: User,
  otherEmail: string,
  endpoint: string,
  queueId: string,
  resolutionStatus: ResolutionStatus
): Promise<void> => {
  const queueContents = await AccountModel.findOneAndUpdate(
    {
      "owner.endpoint": endpoint,
      "owner.email": user.email,
      "activeQueues._id": queueId,
    },
    { $pull: { "activeQueues.$.entries": { "user.email": otherEmail } } },
    { new: false, projection: { "activeQueues.$": 1 } }
  );

  if (
    !queueContents ||
    !queueContents.activeQueues ||
    queueContents.activeQueues.length === 0
  ) {
    throw new Error("could not find queue");
  }
  // add it to the archived place
  const removedEntry = (
    queueContents.activeQueues as unknown as ActiveQueue[]
  )[0].entries.find((entry) => entry.user.email === otherEmail);

  if (!removedEntry) {
    throw new Error("could not find entry");
  }

  const resolution = {
    user,
    timestamp: new Date().toISOString(),
    status: resolutionStatus,
  };

  const archivedVersion = new ArchivedModel({
    _id: new mongoose.Types.ObjectId(),
    request: removedEntry,
    resolution,
  });

  await archivedVersion.save();
};

const renameQueue = async (
  endpoint: string,
  ownerEmail: string,
  queueId: string,
  newName: string
): Promise<void> => {
  const result = await AccountModel.findOneAndUpdate(
    {
      "owner.endpoint": endpoint,
      "owner.email": ownerEmail,
      "activeQueues._id": queueId,
    },
    {
      $set: {
        "activeQueues.$.displayName": newName,
      },
    },
    { new: true }
  );

  if (!result) {
    throw new Error("User doesn't own queue, or could not find queue");
  }
};

// // add a queue
// const addQueue = (owner: Owner, queueName: string): void => {};

// // hide/show/rename/remove a queue
// const hideQueue = (owner: Owner, queueId: string): void => {};

// const showQueue = (owner: Owner, queueId: string): void => {};

// const deleteQueue = (owner: Owner, queueId: string): void => {};

export default {
  getQueuesForStudent,
  getQueuesForTeacher,
  addActiveEntry,
  resolveMyEntry,
  resolveOthersEntry,
  renameQueue,
};
