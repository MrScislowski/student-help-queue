import axios from "axios";
import config from "./config";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api/queue`
    : "https://student-help-queue-backend-dbc8c16c81bf.herokuapp.com/api/queue";

console.log(`using baseUrl ${baseUrl}`);

let token = null;

export const setToken = (newValue) => {
  if (newValue) {
    token = `Bearer ${newValue}`;
  } else {
    token = null;
  }
};

export const getActiveEntries = async () => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  return axios.get(`${baseUrl}`, config);
};

export const resolveEntry = async ({ entry, resolutionStatus }) => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  await axios.post(
    `${baseUrl}/${entry._id}`,
    {
      resolutionStatus,
    },
    config
  );
};

const loginUrl = `${config.backendUrl}/api/login`;

export const attemptLogin = async ({ code }) => {
  const response = await axios.post(`${loginUrl}`, { code });
  setToken(response.data.token);
  return response.data;
};

export const addName = async () => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  await axios.post(`${baseUrl}`, null, config);
};
