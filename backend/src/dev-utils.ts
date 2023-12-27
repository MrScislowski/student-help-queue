import mongoose from "mongoose";
import config from "./config";
import { TeacherModel } from "./models/teacher";
import { ClassModel } from "./models/class";
import { Class, Teacher } from "./types";

mongoose
  .connect(config.DB_URL)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err.message}`);
  });

async function createTeachers(): Promise<Teacher[]> {
  const teacher1: Teacher = {
    _id: new mongoose.Types.ObjectId(),
    email: "mr.scislowski@gmail.com",
    username: "mrscislowski",
    classes: [],
  };

  const teacher2: Teacher = {
    _id: new mongoose.Types.ObjectId(),
    email: "dscislowski@usd266.com",
    username: "dscislowski",
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

  const class1: Class = {
    _id: new mongoose.Types.ObjectId(),
    className: "AP Computer Science A",
    classEndpoint: "apcsa",
    teacherId: teachers[0]._id,
    teacherEmail: teachers[0].email,
    queues: [],
  };

  const class2: Class = {
    _id: new mongoose.Types.ObjectId(),
    className: "Computer Programming",
    classEndpoint: "computer-programming",
    teacherId: teachers[0]._id,
    teacherEmail: teachers[0].email,
    queues: [],
  };

  await ClassModel.insertMany([class1, class2]);
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
