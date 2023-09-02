import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  addName,
  attemptLogin,
  resolveEntry,
  setToken,
  getActiveEntries,
} from "./requests";
import Queue from "./components/Queue";
import { GoogleLogin } from "@react-oauth/google";

const App = () => {
  const [timeDiff, setTimeDiff] = useState(0);
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const storedUserInfo = window.localStorage.getItem("studentHelpQueueUser");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      setUser(userInfo);
      setToken(userInfo.token);
    }
  }, []);

  const queryClient = useQueryClient();
  const resolveEntryMutation = useMutation(resolveEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries("activeEntries");
    },
  });

  const addNameMutation = useMutation(addName, {
    onSuccess: () => {
      queryClient.invalidateQueries("activeEntries");
    },
  });

  const result = useQuery({
    queryKey: "activeEntries",
    queryFn: () => {
      getActiveEntries().then((res) => {
        setTimeDiff(
          new Date().getTime() - new Date(res.data.timestamp).getTime()
        );
        setEntries(res.data.entries);
        return res.data.entries;
      });
    },
    refetchInterval: user && user.isAdmin ? 2000 : 15000,
    refetchIntervalInBackground: user && user.isAdmin,
  });

  //   );

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
        <p>
          logged in as {user.email}{" "}
          <button
            onClick={() => {
              window.localStorage.removeItem("studentHelpQueueUser");
              setUser(null);
              setToken(null);
              queryClient.invalidateQueries("activeEntries");
            }}
          >
            log out
          </button>
        </p>
      ) : (
        <GoogleLogin
          onSuccess={(response) => {
            const { credential } = response;
            attemptLogin({ credential }).then((response) => {
              setUser(response);
              window.localStorage.setItem(
                "studentHelpQueueUser",
                JSON.stringify(response)
              );
              queryClient.invalidateQueries("activeEntries");
            });
          }}
          onError={(error) => console.log(`Login error: ${error}`)}
          ux_mode="redirect"
        />
      )}
      {user && (
        <button onClick={() => addNameMutation.mutate()}>
          Add name to queue
        </button>
      )}
      <Queue
        entries={entries}
        resolveEntryMutation={resolveEntryMutation}
        getEntryAge={getEntryAge}
      />
    </>
  );
};

export default App;
