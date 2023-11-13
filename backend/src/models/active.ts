import mongoose from "mongoose";
import { ActiveEntry, User } from "../types";

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

const schema = new mongoose.Schema<ActiveEntry>({
  user: {
    type: userSchema,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  queueName: {
    type: String,
    required: true,
  },
});

const ActiveModel = mongoose.model<ActiveEntry>("Active", schema);

export { ActiveModel as Active, userSchema, schema as activeEntrySchema };
