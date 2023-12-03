import axios from "axios";
import { Queue, ResolutionStatus, User } from "./types";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api/`
    : "https://student-help-queue-backend-dbc8c16c81bf.herokuapp.com/api/";

let token: string | null = null;

export const setToken = (newValue: string | null) => {
  if (newValue) {
    token = `Bearer ${newValue}`;
  } else {
    token = null;
  }
};

export const getActiveEntries = async (
  endpoint: string
): Promise<{
  timestamp: string;
  queues: Queue[];
}> => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  return (await axios.get(`${baseUrl}/classes/${endpoint}/queues`, config))
    .data;
};

export const addName = async (
  classId: string,
  queueId: string
): Promise<void> => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  return (
    await axios.post(`${baseUrl}/classes/${classId}/queues/${queueId}`, config)
  ).data;
};

export const resolveEntry = async (
  classId: string,
  queueId: string,
  resolutionStatus: ResolutionStatus
) => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  await axios.delete(
    `${baseUrl}/classes/${classId}/queues/${queueId}/resolve`,
    {
      ...config,
      data: resolutionStatus,
    }
  );
};

const activeQueuesUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api/queues/active`
    : "https://student-help-queue-backend-dbc8c16c81bf.herokuapp.com/api/queues/active";

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
