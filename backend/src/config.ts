import dotenv from "dotenv";
dotenv.config();

const DB_URL = process.env.OFFLINE_DB_URL || "default";
const PORT = 3000;

export default { DB_URL, PORT };
