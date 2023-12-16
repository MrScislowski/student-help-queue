import { useState, useEffect, useContext } from "react";
import SessionContext from "./SessionContext";

import { setToken } from "./requests";
import Header from "./components/Header";
import LoginButton from "./components/LoginButton";
import QueueSet from "./components/QueueSet";
import { Session } from "./types";
import { QueryClient, QueryClientProvider } from "react-query";
import AddQueueForm from "./components/AddQueueForm";

const queryClient = new QueryClient();

interface AppProps {
  classId: string;
}

const App = ({ classId }: AppProps) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const storedUserInfo = window.localStorage.getItem("studentHelpQueueUser");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      setSession(userInfo);
      setToken(userInfo.token);
    }
  }, []);

  // TODO: could re-implement session context to provide the setter method. Then this logout could be moved into the loginbutton component
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
      <SessionContext.Provider value={session}>
        <Header handleLogout={handleLogout} />
        <AddQueueForm classId={classId} />
        <QueueSet classId={classId} />
      </SessionContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
