import mongoose from "mongoose";
import { User } from "../types";

const schema = new mongoose.Schema<User>({
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
  role: {
    type: String,
    required: true,
    enum: ["teacher", "student"],
  },
  accessToken: {
    required: false,
    access_token: {
      type: String,
      required: true,
    },
    expires_in: {
      type: Number,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      required: true,
    },
    token_type: {
      type: String,
      required: true,
    },
  },
});

export default mongoose.model<User>("User", schema);
