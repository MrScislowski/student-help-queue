import mongoose from "mongoose";
import { User } from "../types";

const userSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
    },
    givenName: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const UserModel = mongoose.model<User>("User", userSchema);

export { userSchema, UserModel };
