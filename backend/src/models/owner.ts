import mongoose from "mongoose";
import { Owner } from "../types";

const ownerSchema = new mongoose.Schema<Owner>(
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
    endpoint: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const OwnerModel = mongoose.model<Owner>("Owner", ownerSchema);

export { ownerSchema, OwnerModel };
