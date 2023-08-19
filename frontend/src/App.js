import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import styled from "styled-components";
import { resolveEntry, cancelEntry } from "./requests";

// TODO: define a mutation, call it for the resolve and cancel button, and invalidate queries

const QueueContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #8d94ba;
  padding: 10px;
  border-radius: 10px;
`;

const QueueItem = styled.div`
  background-color: #a0cfd3;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
`;

const ResolveButton = styled.button`
  background-color: rgb(233, 246, 233);
  border: none;
  border-radius: 5px;
`;

const CancelButton = styled.button`
  background-color: rgb(255, 241, 223);
  border: none;
  border-radius: 5px;
`;

const App = () => {
  const [timeDiff, setTimeDiff] = useState(0);

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
    const millis =
      new Date().getTime() - new Date(timestamp).getTime() - timeDiff;
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
    <QueueContainer>
      {result.data.map((item) => {
        return (
          <QueueItem key={item.requestor.id}>
            {item.requestor.displayName} ({getEntryAge(item.requestTimestamp)})
            <ResolveButton
              onClick={async () => {
                await resolveEntryMutation.mutate({
                  entry: item,
                  resolutionStatus: "resolve",
                });
              }}
            >
              Resolve
            </ResolveButton>
            <CancelButton
              onClick={async () => {
                await resolveEntryMutation.mutate({
                  entry: item,
                  resolutionStatus: "cancel",
                });
              }}
            >
              Cancel
            </CancelButton>
          </QueueItem>
        );
      })}
    </QueueContainer>
  );
};

export default App;
