import mongoose from "mongoose";

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
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
});

export default mongoose.model("Active", schema);

// const mongoose = require("mongoose");

// // you must install this library
// const uniqueValidator = require("mongoose-unique-validator");

// const schema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     minlength: 5,
//   },
//   favoriteGenre: {
//     type: String,
//     required: true,
//     unique: false,
//   },
// });

// schema.plugin(uniqueValidator);

// module.exports = mongoose.model("User", schema);
