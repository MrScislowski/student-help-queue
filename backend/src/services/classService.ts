import mongoose from "mongoose";
import { ClassModel } from "../models/class";
import { TeacherModel } from "../models/teacher";
import { Class, Queue, ResolutionStatus, Teacher, User } from "../types";
import { handleDatabaseError } from "../utils/errorHandlers";

const getClassData = async (
  teacherSlug: string,
  classSlug: string
): Promise<Class> => {
  let teacher;
  try {
    teacher = await TeacherModel.findOne({ slug: teacherSlug });
  } catch (err: any) {
    handleDatabaseError(err);
  }

  if (!teacher) {
    throw new Error(`teacher ${teacherSlug} not found}`);
  }

  let classData;
  try {
    classData = await ClassModel.findOne({
      teacher: teacher._id,
      classSlug: classSlug,
    }).populate("teacher");
  } catch (err) {
    handleDatabaseError(err);
  }

  if (!classData) {
    throw new Error("ClassNotFound");
  }

  return classData as unknown as Class;
};

// create a new queue for a class
const addQueue = async (
  email: string,
  classSlug: string,
  queueName: string
): Promise<void> => {
  const classData = await ClassModel.findOne({ classSlug: classSlug }).populate(
    "teacher"
  );

  const unpopulatedClassData = await ClassModel.findOne({
    classSlug: classSlug,
  });

  console.log("classData:");
  console.log(classData);

  console.log("unpopulatedClassData:");
  console.log(unpopulatedClassData);

  if (!classData) {
    throw new Error("ClassNotFound");
  }

  console.log("about to check teacher email");

  if ((classData.teacher as unknown as Teacher).email !== email) {
    console.log("teacher email doesn't match");
    throw new Error("Unauthorized");
  }

  // FIXME: should maybe check if the displayName is already taken

  // FIXME: is it better to do this as a $push operation in Mongo, or do it locally then .save()?

  const newQueue: Queue = {
    _id: new mongoose.Types.ObjectId(),
    displayName: queueName,
    entries: [],
    visible: true,
  };

  classData.queues.push(newQueue);

  try {
    await classData.save();
    console.log("saved class data");
  } catch (err) {
    console.log("error while saving class data");
    console.log(err);

    handleDatabaseError(err);
  }
};

export default {
  // getQueuesForClass,
  // addActiveEntry,
  // resolveMyEntry,
  // resolveOthersEntry,
  // renameQueue,
  // addQueue,
  // deleteQueue,
  // changeVisibility,
  getClassData,
  addQueue,
};

// // add an entry
// const addActiveEntry = async (
//   user: User,
//   endpoint: string,
//   queueId: string
// ): Promise<void> => {
//   const newEntry: ActiveEntry = {
//     timestamp: new Date().toISOString(),
//     user: user,
//   };

//   await AccountModel.findOneAndUpdate(
//     {
//       "owner.endpoint": endpoint,
//       "activeQueues._id": queueId,
//       "activeQueues.$.entries": {
//         $not: {
//           $elemMatch: {
//             "user.email": user.email,
//           },
//         },
//       },
//     },
//     {
//       $push: {
//         "activeQueues.$.entries": newEntry,
//       },
//     }
//   );
// };

// // resolve an entry belonging to me
// const resolveMyEntry = async (
//   user: User,
//   endpoint: string,
//   queueId: string,
//   resolutionStatus: ResolutionStatus
// ): Promise<void> => {
//   // pull it out of the array

//   const queueContents = await AccountModel.findOneAndUpdate(
//     { "owner.endpoint": endpoint, "activeQueues._id": queueId },
//     { $pull: { "activeQueues.$.entries": { "user.email": user.email } } },
//     { new: false, projection: { "activeQueues.$": 1 } }
//   );

//   if (
//     !queueContents ||
//     !queueContents.activeQueues ||
//     queueContents.activeQueues.length === 0
//   ) {
//     throw new Error("could not find queue");
//   }
//   // add it to the archived place
//   const removedEntry = (
//     queueContents.activeQueues as unknown as ActiveQueue[]
//   )[0].entries.find((entry) => entry.user.email === user.email);

//   if (!removedEntry) {
//     throw new Error("could not find entry");
//   }

//   const resolution = {
//     user,
//     timestamp: new Date().toISOString(),
//     status: resolutionStatus,
//   };

//   const archivedVersion = new ArchivedModel({
//     _id: new mongoose.Types.ObjectId(),
//     request: removedEntry,
//     resolution,
//   });

//   await archivedVersion.save();
// };

// // resolve an entry belonging to someone else
// const resolveOthersEntry = async (
//   user: User,
//   otherEmail: string,
//   endpoint: string,
//   queueId: string,
//   resolutionStatus: ResolutionStatus
// ): Promise<void> => {
//   const queueContents = await AccountModel.findOneAndUpdate(
//     {
//       "owner.endpoint": endpoint,
//       "owner.email": user.email,
//       "activeQueues._id": queueId,
//     },
//     { $pull: { "activeQueues.$.entries": { "user.email": otherEmail } } },
//     { new: false, projection: { "activeQueues.$": 1 } }
//   );

//   if (
//     !queueContents ||
//     !queueContents.activeQueues ||
//     queueContents.activeQueues.length === 0
//   ) {
//     throw new Error("could not find queue");
//   }
//   // add it to the archived place
//   const removedEntry = (
//     queueContents.activeQueues as unknown as ActiveQueue[]
//   )[0].entries.find((entry) => entry.user.email === otherEmail);

//   if (!removedEntry) {
//     throw new Error("could not find entry");
//   }

//   const resolution = {
//     user,
//     timestamp: new Date().toISOString(),
//     status: resolutionStatus,
//   };

//   const archivedVersion = new ArchivedModel({
//     _id: new mongoose.Types.ObjectId(),
//     request: removedEntry,
//     resolution,
//   });

//   await archivedVersion.save();
// };

// const renameQueue = async (
//   endpoint: string,
//   ownerEmail: string,
//   queueId: string,
//   newName: string
// ): Promise<void> => {
//   const result = await AccountModel.findOneAndUpdate(
//     {
//       "owner.endpoint": endpoint,
//       "owner.email": ownerEmail,
//       "activeQueues._id": queueId,
//     },
//     {
//       $set: {
//         "activeQueues.$.displayName": newName,
//       },
//     },
//     { new: true }
//   );

//   if (!result) {
//     throw new Error("User doesn't own queue, or could not find queue");
//   }
// };

// const addQueue = async (
//   endpoint: string,
//   ownerEmail: string,
//   queueName: string
// ): Promise<void> => {
//   const newQueue: ActiveQueue = {
//     _id: new mongoose.Types.ObjectId(),
//     displayName: queueName,
//     entries: [],
//     visible: true,
//   };

//   const result = await AccountModel.findOneAndUpdate(
//     { "owner.endpoint": endpoint, "owner.email": ownerEmail },
//     {
//       $push: {
//         activeQueues: newQueue,
//       },
//     }
//   );

//   if (!result) {
//     throw new Error("User doesn't own queue, or could not find queue");
//   }
// };

// const deleteQueue = async (
//   endpoint: string,
//   ownerEmail: string,
//   queueId: string
// ): Promise<void> => {
//   const result = await AccountModel.findOneAndUpdate(
//     { "owner.endpoint": endpoint, "owner.email": ownerEmail },
//     {
//       $pull: {
//         activeQueues: { _id: queueId },
//       },
//     }
//   );

//   if (!result) {
//     throw new Error("User doesn't own queue, or could not find queue");
//   }
// };

// const changeVisibility = async (
//   endpoint: string,
//   ownerEmail: string,
//   queueId: string,
//   visible: boolean
// ): Promise<void> => {
//   const result = await AccountModel.findOneAndUpdate(
//     {
//       "owner.endpoint": endpoint,
//       "owner.email": ownerEmail,
//       "activeQueues._id": queueId,
//     },
//     {
//       $set: {
//         "activeQueues.$.visible": visible,
//       },
//     },
//     { new: true }
//   );

//   if (!result) {
//     throw new Error("User doesn't own queue, or could not find queue");
//   }
// };
