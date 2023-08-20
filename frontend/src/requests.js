import axios from "axios";

const baseUrl = `http://localhost:3001/api/queue`;

let token = null;
export const setToken = (newValue) => {
  token = `Bearer ${newValue}`;
};

export const resolveEntry = async ({ entry, resolutionStatus }) => {
  const config = {
    headers: { Authorization: token },
  };
  await axios.post(
    `${baseUrl}/${entry._id}`,
    {
      resolutionStatus,
    },
    config
  );
};

const loginUrl = `http://localhost:3001/api/login`;
// TODO: in future I think this info should be sent directly to the backend via the stored callback url in Google so that we never see it on the user end
export const attemptLogin = async ({ credential }) => {
  const response = await axios.post(`${loginUrl}`, { credential });
  setToken(response.data.token);
  return response.data;
};

export const addName = async () => {
  const config = {
    headers: { Authorization: token },
  };
  await axios.post(`${baseUrl}`, null, config);
};
