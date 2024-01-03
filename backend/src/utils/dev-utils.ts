import mongoose from "mongoose";
import config from "../config";
import { TeacherModel } from "../models/teacher";
import { ClassModel } from "../models/class";
import { Class, ClassBase, Teacher, TeacherBase } from "../types";

mongoose
  .connect(config.DB_URL)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err.message}`);
  });

async function createTeachers(): Promise<TeacherBase[]> {
  const teacher1: Teacher = {
    _id: new mongoose.Types.ObjectId(),
    email: "mr.scislowski@gmail.com",
    slug: "mrscislowski",
    classes: [],
  };

  const teacher2: Teacher = {
    _id: new mongoose.Types.ObjectId(),
    email: "dscislowski@usd266.com",
    slug: "dscislowski",
    classes: [],
  };

  try {
    await TeacherModel.deleteMany({});

    await TeacherModel.insertMany([teacher1, teacher2]);
    const result = await TeacherModel.find({});
    if (!result) {
      throw new Error("no teachers found");
    }
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function createClasses(teachers: Teacher[]): Promise<void> {
  await ClassModel.deleteMany({});

  const class1: ClassBase = {
    _id: new mongoose.Types.ObjectId(),
    classSlug: "apcsa",
    teacher: teachers[0]._id,
    queues: [],
  };

  await ClassModel.insertMany([class1]);
  await TeacherModel.findByIdAndUpdate(teachers[0]._id, {
    $push: { classes: class1._id },
  });

  const class2: ClassBase = {
    _id: new mongoose.Types.ObjectId(),
    classSlug: "computer_programming",
    teacher: teachers[0]._id,
    queues: [],
  };

  await ClassModel.insertMany([class2]);
  await TeacherModel.findByIdAndUpdate(teachers[0]._id, {
    $push: { classes: class2._id },
  });
}

async function fillQueues(): Promise<void> {
  //   try {
  //     const activeAccount = await AccountModel.findOne({
  //       "owner.email": "mr.scislowski@gmail.com",
  //     });
  //     if (!activeAccount) {
  //       throw new Error("account not found");
  //     }
  //     activeAccount.activeQueues.push(helpQueue, completedQueue);
  //     await activeAccount.save();
  //     for (let count = 0; count < 5; count++) {
  //       const entry: ActiveEntry = {
  //         timestamp: new Date(
  //           Date.now() - Math.random() * 20 * 60 * 1000
  //         ).toISOString(),
  //         user: {
  //           email: `${Math.random().toString(36).substr(2, 5)}@gmail.com`,
  //           familyName: Math.random().toString(36).substr(2, 5),
  //           givenName: Math.random().toString(36).substr(2, 5),
  //         },
  //       };
  //       activeAccount.activeQueues
  //         .find((q) => q._id === helpQueue._id)
  //         ?.entries.push(entry);
  //       await activeAccount.save();
  //     }
  //   } catch (err) {
  //     console.log("Error: ", err);
  //   }
}

createTeachers()
  .then((teachers) => createClasses(teachers))
  .then(() => console.log("db filled"))
  .then(() => mongoose.connection.close())
  .then(() => console.log("goodbye"))
  .catch(() => console.log("error occured shutting down"));
