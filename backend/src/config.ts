import dotenv from "dotenv";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "production";

const OFFLINE_DB_URL = process.env.OFFLINE_DB_URL
  ? process.env.OFFLINE_DB_URL
  : "";

const MONGODB_ATLAS_DB_URL = process.env.MONGODB_ATLAS_DB_URL
  ? process.env.MONGODB_ATLAS_DB_URL
  : "";

let DB_URL = "";
if (NODE_ENV === "dev") {
  DB_URL = OFFLINE_DB_URL;
} else {
  DB_URL = MONGODB_ATLAS_DB_URL;
}

const PORT = process.env.PORT || 3001;
const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

const SECRET = process.env.SECRET || "";

export default {
  DB_URL,
  PORT,
  GOOGLE_OAUTH_CLIENT_ID,
  SECRET,
  GOOGLE_OAUTH_CLIENT_SECRET,
};
