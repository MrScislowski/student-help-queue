import { ActiveEntry, ActiveQueue, ResolutionStatus, User } from "../types";
import { AccountModel } from "../models/account";
import mongoose from "mongoose";
import ArchivedModel from "../models/archived";

const getQueuesForClass = async (
  endpoint: string,
  userEmail: string
): Promise<ActiveQueue[] | null> => {
  // TODO: simplify this once Mongo schema is improved
  const allData = await AccountModel.aggregate([
    {
      $match: { "owner.endpoint": endpoint },
    },
    {
      $project: {
        activeQueues: {
          $cond: {
            if: { $eq: ["$owner.email", userEmail] },
            then: "$activeQueues",
            else: {
              $filter: {
                input: "$activeQueues",
                as: "queue",
                cond: { $eq: ["$$queue.visible", true] },
              },
            },
          },
        },
      },
    },
  ]);

  if (!allData || allData.length === 0) {
    return null;
  }

  const returnData: ActiveQueue[] = allData[0].activeQueues;

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

const addQueue = async (
  endpoint: string,
  ownerEmail: string,
  queueName: string
): Promise<void> => {
  const newQueue: ActiveQueue = {
    _id: new mongoose.Types.ObjectId(),
    displayName: queueName,
    entries: [],
    visible: true,
  };

  const result = await AccountModel.findOneAndUpdate(
    { "owner.endpoint": endpoint, "owner.email": ownerEmail },
    {
      $push: {
        activeQueues: newQueue,
      },
    }
  );

  if (!result) {
    throw new Error("User doesn't own queue, or could not find queue");
  }
};

const deleteQueue = async (
  endpoint: string,
  ownerEmail: string,
  queueId: string
): Promise<void> => {
  const result = await AccountModel.findOneAndUpdate(
    { "owner.endpoint": endpoint, "owner.email": ownerEmail },
    {
      $pull: {
        activeQueues: { _id: queueId },
      },
    }
  );

  if (!result) {
    throw new Error("User doesn't own queue, or could not find queue");
  }
};

export default {
  getQueuesForClass,
  addActiveEntry,
  resolveMyEntry,
  resolveOthersEntry,
  renameQueue,
  addQueue,
  deleteQueue,
};
