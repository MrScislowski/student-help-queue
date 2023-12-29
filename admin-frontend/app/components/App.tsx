import { useState, useEffect, useContext } from "react";
import SessionContext from "./SessionContext";

import { setToken } from "../requests/requests";
import LoginButton from "./LoginButton";
import { Session } from "../types";
import { QueryClient, QueryClientProvider } from "react-query";
import { isSession } from "../utils";
import TeacherPage from "./TeacherPage";
import config from "../config";

const queryClient = new QueryClient();

interface AppProps {}

const App = ({}: AppProps) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const storedUserInfo = window.localStorage.getItem(config.cookieName);
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      if (isSession(userInfo)) {
        setSession(userInfo);
        setToken(userInfo.token);
      } else {
        handleLogout();
      }
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
        <TeacherPage />
      </SessionContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
