import { useState, useEffect } from "react";

import { setToken } from "./requests";
import Header from "./components/Header";
import LoginButton from "./components/LoginButton";
import QueueSet from "./components/QueueSet";
import { User } from "./types";

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUserInfo = window.localStorage.getItem("studentHelpQueueUser");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      setUser(userInfo);
      setToken(userInfo.token);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("studentHelpQueueUser");
    setUser(null);
    setToken(null);
  };

  if (!user) {
    return <LoginButton setUser={setUser} />;
  }

  return (
    <>
      <Header user={user} handleLogout={handleLogout} />
      <QueueSet user={user} />
    </>
  );
};

export default App;
