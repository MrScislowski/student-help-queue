import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { addName, attemptLogin, resolveEntry } from "./requests";
import Queue from "./components/Queue";
import { GoogleLogin } from "@react-oauth/google";

const App = () => {
  const [timeDiff, setTimeDiff] = useState(0);
  const [user, setUser] = useState(null);

  const queryClient = useQueryClient();
  const resolveEntryMutation = useMutation(resolveEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries("activeEntries");
    },
  });

  const result = useQuery("activeEntries", () =>
    axios.get("http://localhost:3001/api/queue").then((res) => {
      setTimeDiff(
        new Date().getTime() - new Date(res.data.timestamp).getTime()
      );
      return res.data.entries;
    })
  );

  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  // https://stackoverflow.com/questions/72766908/how-to-show-a-countdown-timer-in-react
  useEffect(() => {
    // every 6 seconds
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000 * 6);
    // TODO: learn what this "clean up" does
    return () => interval;
  }, []);

  if (result.isLoading) {
    return <div>loading...</div>;
  }

  const getEntryAge = (timestamp) => {
    const millis = currentTime - new Date(timestamp).getTime() - timeDiff;
    const minutes = Math.floor(millis / 1000 / 60);
    if (minutes < 1) {
      return "< 1m";
    } else if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ${minutes - hours * 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <>
      {user ? (
        <p>logged in as {user.email}</p>
      ) : (
        <GoogleLogin
          // TODO: save the response to attemptLogin in localstorage or something. and move the token to be using state in a service like they do here:
          // https://fullstackopen.com/en/part5/login_in_frontend
          onSuccess={(response) => {
            const { credential } = response;
            attemptLogin({ credential }).then((response) => setUser(response));
          }}
          onError={(error) => console.log(`Login error: ${error}`)}
        />
      )}
      <button onClick={addName}>Add name to queue</button>
      <Queue
        entries={result}
        resolveEntryMutation={resolveEntryMutation}
        getEntryAge={getEntryAge}
      />
    </>
  );
};

export default App;
