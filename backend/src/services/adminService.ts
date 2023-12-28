const administrators = ["mr.scislowski@gmail.com", "dscislowski@usd266.com"];

const isAdmin = (email: string) => {
  return administrators.includes(email);
};

export default {
  isAdmin,
};
