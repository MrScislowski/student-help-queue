import axios from "axios";
import { ActiveEntry, ResolutionStatus } from "./types";

const activeEntriesUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api/activeEntries`
    : "https://student-help-queue-backend-dbc8c16c81bf.herokuapp.com/api/activeEntries";

let token: string | null = null;

export const setToken = (newValue: string | null) => {
  if (newValue) {
    token = `Bearer ${newValue}`;
  } else {
    token = null;
  }
};

export const getActiveEntries = async () : Promise<{timestamp: string, entries: ActiveEntry[]}> =>  {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  return axios.get(`${activeEntriesUrl}`, config);
};

export const addName = async (queueName: string) => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  await axios.post(`${activeEntriesUrl}`, { queueName }, config);
};

export const resolveEntry = async ({ entry, resolutionStatus }: {entry: ActiveEntry, resolutionStatus: ResolutionStatus}) => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  await axios.post(
    `${activeEntriesUrl}/${entry._id}`,
    {
      resolutionStatus,
    },
    config
  );
};

const activeQueuesUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api/queues/active`
    : "https://student-help-queue-backend-dbc8c16c81bf.herokuapp.com/api/queues/active";

export const getActiveQueues = async () : Promise<string[]> => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  return axios.get(`${activeQueuesUrl}`, config);
};

const loginUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api/login`
    : "https://student-help-queue-backend-dbc8c16c81bf.herokuapp.com/api/login";
// TODO: in future I think this info should be sent directly to the backend via the stored callback url in Google so that we never see it on the user end

export const attemptLogin = async (credential: string) => {
  const response = await axios.post(`${loginUrl}`, { credential: credential });
  setToken(response.data.token);
  return response.data;
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
