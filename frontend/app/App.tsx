import { useState, useEffect } from "react";

import { setToken } from "./requests";
import Header from "./components/Header";
import LoginButton from "./components/LoginButton";
import QueueSet from "./components/QueueSet";
import { Session } from "./types";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const storedUserInfo = window.localStorage.getItem("studentHelpQueueUser");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      setSession(userInfo);
      setToken(userInfo.token);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("studentHelpQueueUser");
    setSession(null);
    setToken(null);
  };

  if (!session) {
    return <LoginButton setSession={setSession} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Header session={session} handleLogout={handleLogout} />
      <QueueSet session={session} />
    </QueryClientProvider>
  );
};

export default App;
