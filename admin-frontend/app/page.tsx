"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginButton from "./components/LoginButton";
import App from "./components/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

export default function Home() {
  console.log(
    `process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID: ${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}`
  );

  return (
    <GoogleOAuthProvider
      clientId={
        process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ||
        "client_id_not_supplied_from_environment_variable"
      }
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
