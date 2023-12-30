import { useState, useEffect, useContext } from "react";
import SessionContext from "./SessionContext";

import { setToken } from "../utils/requests";
import Header from "./Header";
import LoginButton from "./LoginButton";
import QueueSet from "./QueueSet";
import { Session } from "../types/types";
import { QueryClient, QueryClientProvider } from "react-query";
import AddQueueForm from "./AddQueueForm";
import config from "../config/config";

const queryClient = new QueryClient();

interface AppProps {
  classId: string;
}

const App = ({ classId }: AppProps) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const storedUserInfo = window.localStorage.getItem(config.cookieName);
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      setSession(userInfo);
      setToken(userInfo.token);
    }
  }, []);

  // TODO: could re-implement session context to provide the setter method. Then this logout could be moved into the loginbutton component
  const handleLogout = () => {
    window.localStorage.removeItem(config.cookieName);
    setSession(null);
    setToken(null);
  };

  if (!session) {
    return <LoginButton setSession={setSession} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContext.Provider value={session}>
        <Header handleLogout={handleLogout} />
        <AddQueueForm classId={classId} />
        <QueueSet classId={classId} />
      </SessionContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
