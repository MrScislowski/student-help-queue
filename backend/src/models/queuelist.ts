import mongoose from "mongoose";
import { ActiveEntrySchema } from "./active";

const schema = new mongoose.Schema({
  queues: [{ name: String, entries: [ActiveEntrySchema] }],
});

export default mongoose.model("Queuelist", schema);
