import axios from "axios";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001/api`
    : "https://help-queue-backend-cb8730ae9c9f.herokuapp.com";

let token: string | null = null;

export const setToken = (newValue: string | null) => {
  if (newValue) {
    token = `Bearer ${newValue}`;
  } else {
    token = null;
  }
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

export const getTeachers = async () => {
  const response = await axios.get(`${baseUrl}/teachers`, {
    headers: { Authorization: token },
  });
  return response.data;
};

export const createTeacher = async (email: string, slug: string) => {
  const response = await axios.post(
    `${baseUrl}/teachers`,
    {
      email: email,
      slug: slug,
    },
    {
      headers: { Authorization: token },
    }
  );
  return response.data;
};
