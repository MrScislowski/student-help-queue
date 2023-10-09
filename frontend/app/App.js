import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  addName,
  attemptLogin,
  resolveEntry,
  setToken,
  getActiveEntries,
  getAccountInfo,
  addQueue,
} from "./requests";
import Queue from "./components/Queue";
import { GoogleLogin } from "@react-oauth/google";
import React from "react";

const App = () => {
  const [timeDiff, setTimeDiff] = useState(0);
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [proposedNewQueueName, setProposedNewQueueName] = useState("");
  const [accountInfo, setAccountInfo] = useState({
    activeQueues: [],
    archivedQueues: [],
  });

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

  const addNameMutation = useMutation({
    mutationFn: (queueName) => addName(queueName),
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

  useEffect(() => {
    const doTheFetch = async () => {
      const retrievedInfo = await getAccountInfo();
      setAccountInfo(retrievedInfo);
    };
    doTheFetch();
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

  const attemptNewQueueCreation = (queueName) => {
    if (
      accountInfo.activeQueues.includes(queueName) ||
      accountInfo.archivedQueues.includes(queueName)
    ) {
      alert("There's already a queue with that name");
      return;
    }

    addQueue(queueName).then(() => {
      setProposedNewQueueName("");
      // TODO: use queryClient instead of useEffect, then invalidate queries here...
    });
  };

  return (
    <>
      {user ? (
        <p>
          logged in as {user.email}
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
        />
      )}
      <input
        type="text"
        value={proposedNewQueueName}
        onChange={(e) => setProposedNewQueueName(e.target.value)}
      ></input>
      <button onClick={() => attemptNewQueueCreation(proposedNewQueueName)}>
        Add new queue
      </button>
      <br></br>
      {accountInfo.activeQueues.map((queueName) => {
        return (
          <React.Fragment key={`${queueName}-fragment`}>
            <button onClick={() => addNameMutation.mutate(queueName)}>
              + {`${queueName} queue`}
            </button>
            <Queue
              entries={entries.filter((entry) => entry.queueName === queueName)}
              resolveEntryMutation={resolveEntryMutation}
              getEntryAge={getEntryAge}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default App;
