"use client";

import { useState, useEffect, useContext } from "react";
import SessionContext from "@components/SessionContext";

import { setToken } from "@utils/requests";
import Header from "@components/Header";
import LoginButton from "@components/LoginButton";
import QueueSet from "@components/QueueSet";
import { Session } from "@appTypes/types";
import { QueryClient, QueryClientProvider } from "react-query";
import AddQueueForm from "@components/AddQueueForm";
import config from "@config/config";
import { GoogleOAuthProvider } from "@react-oauth/google";
import TeacherPage from "@/components/TeacherPage";
import AddClassForm from "@/components/AddClassForm";

const queryClient = new QueryClient();

interface HomeProps {
  params: {
    teacherSlug: string;
  };
}

const Home = ({ params }: HomeProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const { teacherSlug } = params;

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
    return (
      <GoogleOAuthProvider
        clientId={
          process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ||
          "client_id_not_supplied_from_environment_variable"
        }
      >
        <LoginButton setSession={setSession} />;
      </GoogleOAuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider
      clientId={
        process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ||
        "client_id_not_supplied_from_environment_variable"
      }
    >
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={session}>
          <Header handleLogout={handleLogout} />
          <TeacherPage teacherSlug={teacherSlug} />
          <AddClassForm teacherSlug={teacherSlug} />
        </SessionContext.Provider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default Home;
