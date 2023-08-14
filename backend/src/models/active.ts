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
    unique: false,
  },
  requestorDisplayName: {
    type: String,
    required: true,
    unique: false,
  },
  requestTimestamp: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Active", schema);
