const backendUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_BACKEND
    : process.env.REACT_APP_BACKEND;

export default { backendUrl };
