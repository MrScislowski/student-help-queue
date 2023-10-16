import axios from "axios";
import { ActiveEntry, ResolutionStatus } from "./types";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api/queue`
    : "https://student-help-queue-backend-dbc8c16c81bf.herokuapp.com/api/queue";

let token: string | null = null;

export const setToken = (newValue: string | null) => {
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

export const resolveEntry = async ({ entry, resolutionStatus }: {entry: ActiveEntry, resolutionStatus: ResolutionStatus}) => {
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

const loginUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api/login`
    : "https://student-help-queue-backend-dbc8c16c81bf.herokuapp.com/api/login";
// TODO: in future I think this info should be sent directly to the backend via the stored callback url in Google so that we never see it on the user end

export const attemptLogin = async ({ credential }: {credential: string}) => {
  const response = await axios.post(`${loginUrl}`, { credential });
  setToken(response.data.token);
  return response.data;
};

export const addName = async (queueName: string) => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  await axios.post(`${baseUrl}`, { queueName }, config);
};

const accountUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api/account`
    : "https://student-help-queue-backend-dbc8c16c81bf.herokuapp.com/api/account";

export const getAccountInfo = async () => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }

  return (await axios.get(`${accountUrl}`, config)).data;
};

export const addQueue = async (queueName: string) => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }

  await axios.post(`${accountUrl}/queues`, { queueName }, config);
};

export const archiveQueue = async (queueName: string) => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }

  await axios.post(`${accountUrl}/queues/archive`, { queueName }, config);
};

export const activateQueue = async (queueName: string) => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }

  await axios.post(`${accountUrl}/queues/reactivate`, { queueName }, config);
};

export const deleteQueue = async (queueName: string) => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }

  await axios.post(`${accountUrl}/queues/delete`, { queueName }, config);
};
