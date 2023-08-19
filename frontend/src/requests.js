import axios from "axios";

const baseUrl = `http://localhost:3001/api/queue`;

export const resolveEntry = async ({ entry, resolutionStatus }) => {
  await axios.post(`${baseUrl}/${entry._id}`, {
    user: { id: "me", displayName: "me" },
    resolutionStatus,
  });
};
