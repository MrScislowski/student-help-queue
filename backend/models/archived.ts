import mongoose from "mongoose";

const schema = new mongoose.Schema({
  // id: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  requestorId: {
    type: String,
    required: true,
  },
  requestorDisplayName: {
    type: String,
    required: true,
  },
  requestTimestamp: {
    type: String,
    required: true,
  },
  resolverId: {
    type: String,
    required: true,
  },
  resolverDisplayName: {
    type: String,
    required: true,
  },
  resolveTimestamp: {
    type: String,
    required: true,
  },
  resolutionStatus: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Archived", schema);
