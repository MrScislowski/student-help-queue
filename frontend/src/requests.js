import axios from "axios";

const baseUrl = `http://localhost:3001/api/queue`;

export const resolveEntry = async ({ entry, resolutionStatus }) => {
  await axios.post(`${baseUrl}/${entry._id}`, {
    user: { id: "me", displayName: "me" },
    resolutionStatus,
  });
};

const loginUrl = `http://localhost:3001/api/login`;
// TODO: in future I think this info should be sent directly to the backend via the stored callback url in Google so that we never see it on the user end
export const attemptLogin = async ({ credential }) => {
  console.log("login being attempted with following credential");
  console.dir(credential);
  const response = await axios.post(`${loginUrl}`, { credential });
  console.dir(response.data);
};
