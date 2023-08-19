import dotenv from "dotenv";
dotenv.config();

const DB_URL = process.env.OFFLINE_DB_URL || "default";
const PORT = 3001;
const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;

export default { DB_URL, PORT, GOOGLE_OAUTH_CLIENT_ID };
