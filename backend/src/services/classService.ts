import mongoose from "mongoose";
import { ClassModel } from "../models/class";
import { TeacherModel } from "../models/teacher";
import { Class, Queue, ResolutionStatus, Teacher, User } from "../types";
import { handleDatabaseError } from "../utils/errorHandlers";

// Get all the queues for a class
const getClassData = async (
  teacherSlug: string,
  classSlug: string
): Promise<Class> => {
  let teacher;
  try {
    teacher = await TeacherModel.findOne({ slug: teacherSlug });
  } catch (err: unknown) {
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

const createNewClass = async (
  email: string,
  teacherSlug: string,
  classSlug: string,
  className: string
): Promise<void> => {
  const teacher = await TeacherModel.findOne({ slug: teacherSlug });

  if (!teacher) {
    throw new Error(`teacher ${teacherSlug} not found}`);
  }

  if (teacher.email !== email) {
    throw new Error(
      "Unauthorized - you must be the teacher to create the class"
    );
  }

  const newClass = new ClassModel({
    _id: new mongoose.Types.ObjectId(),
    teacher: teacher._id,
    classSlug: classSlug,
    className: className,
    queues: [],
  });

  try {
    await newClass.save();
    await teacher.updateOne({ $push: { classes: newClass._id } });
  } catch (err) {
    handleDatabaseError(err);
  }
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

  if (!classData) {
    throw new Error("ClassNotFound");
  }

  if ((classData.teacher as unknown as Teacher).email !== email) {
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
  } catch (err) {
    handleDatabaseError(err);
  }
};

// delete a queue
const deleteQueue = async (
  email: string,
  classSlug: string,
  queueId: string
): Promise<void> => {
  const classData = await ClassModel.findOne({
    classSlug: classSlug,
    "queues._id": queueId,
  }).populate("teacher");

  if (!classData) {
    throw new Error("No queue found in that class");
  }

  if ((classData.teacher as unknown as Teacher).email !== email) {
    throw new Error("Unauthorized");
  }

  // FIXME: maybe use mongoose's $pull instead of doing it locally then .save()?
  classData.queues = classData.queues.filter(
    (queue) => queue._id.toString() !== queueId
  );

  try {
    await classData.save();
  } catch (err) {
    handleDatabaseError(err);
  }
};

// set visibility of a queue
const setVisibility = async (
  email: string,
  classSlug: string,
  queueId: string,
  visible: boolean
): Promise<void> => {
  const classData = await ClassModel.findOne({
    classSlug: classSlug,
    "queues._id": queueId,
  }).populate("teacher");

  if (!classData) {
    throw new Error("No queue found in that class");
  }

  if ((classData.teacher as unknown as Teacher).email !== email) {
    throw new Error("Unauthorized");
  }

  // FIXME: maybe use mongoose's $set and positional operator directly
  classData.queues = classData.queues.map((queue) => {
    if (queue._id.toString() === queueId) {
      queue.visible = visible;
    }
    return queue;
  });

  try {
    await classData.save();
  } catch (err) {
    handleDatabaseError(err);
  }
};

const renameQueue = async (
  email: string,
  classSlug: string,
  queueId: string,
  newName: string
): Promise<void> => {
  const classData = await ClassModel.findOne({
    classSlug: classSlug,
    "queues._id": queueId,
  }).populate("teacher");

  if (!classData) {
    throw new Error("No queue found in that class");
  }

  if ((classData.teacher as unknown as Teacher).email !== email) {
    throw new Error("Unauthorized");
  }

  classData.queues = classData.queues.map((queue) => {
    if (queue._id.toString() === queueId) {
      queue.displayName = newName;
    }
    return queue;
  });

  try {
    await classData.save();
  } catch (err) {
    handleDatabaseError(err);
  }
};

const addUserToQueue = async (
  classSlug: string,
  queueId: string,
  userToAdd: User,
  userAdding: User
): Promise<void> => {
  const classData = await ClassModel.findOne({
    classSlug: classSlug,
    "queues._id": queueId,
  }).populate("teacher");

  if (!classData) {
    throw new Error("No queue found in that class");
  }

  if (
    userToAdd.email !== userAdding.email &&
    userAdding.email !== (classData.teacher as unknown as Teacher).email
  ) {
    throw new Error("Insufficient permissions");
  }

  // FIXME: I'm pretty sure $push is superior here (race conditions, etc.)
  classData.queues = classData.queues.map((queue) => {
    if (queue._id.toString() === queueId) {
      if (queue.entries.find((entry) => entry.user.email === userToAdd.email)) {
        throw new Error("User already in queue");
      }

      queue.entries.push({
        user: userToAdd,
        timeAdded: new Date().toISOString(),
      });
    }
    return queue;
  });

  try {
    await classData.save();
  } catch (err) {
    handleDatabaseError(err);
  }
};

// remove user from queue
const removeUserFromQueue = async (
  classSlug: string,
  queueId: string,
  userToRemove: User,
  userRemoving: User,
  _resolutionStatus: ResolutionStatus
): Promise<void> => {
  const classDetails = await ClassModel.findOne({
    classSlug: classSlug,
    "queues._id": queueId,
  }).populate("teacher");

  if (!classDetails) {
    throw new Error("No queue found in that class");
  }

  if (
    userRemoving.email !== userToRemove.email &&
    userRemoving.email !== (classDetails.teacher as unknown as Teacher).email
  ) {
    throw new Error("Insufficient permissions");
  }

  // TODO: implement an archived queue...

  classDetails.queues = classDetails.queues.map((queue) => {
    if (queue._id.toString() === queueId) {
      queue.entries = queue.entries.filter(
        (entry) => entry.user.email !== userToRemove.email
      );
    }
    return queue;
  });

  try {
    await classDetails.save();
  } catch (err) {
    handleDatabaseError(err);
  }
};

export default {
  getClassData,
  addQueue,
  deleteQueue,
  setVisibility,
  renameQueue,
  addUserToQueue,
  removeUserFromQueue,
  createNewClass,
};
