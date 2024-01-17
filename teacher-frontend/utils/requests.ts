import axios from "axios";
import { Queue, ResolutionStatus, Teacher, User } from "../types/types";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api`
    : "https://help-queue-backend-cb8730ae9c9f.herokuapp.com/api";

let token: string | null = null;

export const setToken = (newValue: string | null) => {
  if (newValue) {
    token = `Bearer ${newValue}`;
  } else {
    token = null;
  }
};

export const getQueuesForClass = async (
  teacherSlug: string,
  classSlug: string
): Promise<{
  timestamp: string;
  className: string;
  queues: Queue[];
}> => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  try {
    const response = await axios.get(
      `${baseUrl}/teachers/${teacherSlug}/classes/${classSlug}/queues`,
      config
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error(error.message);
    }
  }
};

export const addName = async (
  teacherSlug: string,
  classSlug: string,
  queueId: string
): Promise<void> => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  return (
    await axios.post(
      `${baseUrl}/teachers/${teacherSlug}/classes/${classSlug}/queues/${queueId}/users`,
      {},
      config
    )
  ).data;
};

export const resolveEntry = async (
  teacherSlug: string,
  classSlug: string,
  queueId: string,
  studentEmail: string,
  resolutionStatus: ResolutionStatus
) => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
      data: { resolutionStatus, email: studentEmail },
    };
  }
  await axios.delete(
    `${baseUrl}/teachers/${teacherSlug}/classes/${classSlug}/queues/${queueId}/users`,
    config
  );
};

export const createQueue = async (
  teacherSlug: string,
  classSlug: string,
  queueName: string
): Promise<void> => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }

  return (
    await axios.post(
      `${baseUrl}/teachers/${teacherSlug}/classes/${classSlug}/queues`,
      { queueName },
      config
    )
  ).data;
};

export const createClass = async (
  teacherSlug: string,
  classSlug: string,
  className: string
): Promise<void> => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }

  return (
    await axios.post(
      `${baseUrl}/teachers/${teacherSlug}/classes`,
      { classSlug, className },
      config
    )
  ).data;
};

export const renameQueue = async (
  teacherSlug: string,
  classSlug: string,
  queueId: string,
  newName: string
) => {
  let config = {
    headers: {},
  };

  const data = {
    queueName: newName,
  };

  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }

  await axios.patch(
    `${baseUrl}/teachers/${teacherSlug}/classes/${classSlug}/queues/${queueId}`,
    data,
    config
  );
};

export const deleteQueue = async (
  teacherSlug: string,
  classSlug: string,
  queueId: string
): Promise<void> => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  return (
    await axios.delete(
      `${baseUrl}/teachers/${teacherSlug}/classes/${classSlug}/queues/${queueId}`,
      config
    )
  ).data;
};

export const changeQueueVisibility = async (
  teacherSlug: string,
  classSlug: string,
  queueId: string,
  visible: boolean
): Promise<void> => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  return (
    await axios.patch(
      `${baseUrl}/teachers/${teacherSlug}/classes/${classSlug}/queues/${queueId}`,
      { visible },
      config
    )
  ).data;
};

const loginUrl = `${baseUrl}/login`;
// TODO: in future I think this info should be sent directly to the backend via the stored callback url in Google so that we never see it on the user end

export const attemptLogin = async (credential: string) => {
  const response = await axios.post(`${loginUrl}`, {
    role: "teacher",
    credential: credential,
  });
  setToken(response.data.token);
  return response.data;
};

export const getTeacherInfo = async (teacherSlug: string): Promise<Teacher> => {
  let config = {};
  if (token) {
    config = {
      headers: { Authorization: token },
    };
  }
  try {
    const response = await axios.get(
      `${baseUrl}/teachers/${teacherSlug}`,
      config
    );

    console.dir(response);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("random message I'm making up...");
    }
  }
};
