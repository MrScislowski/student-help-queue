import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import styled from "styled-components";

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

const App = () => {
  const result = useQuery("activeEntries", () =>
    axios.get("http://localhost:3001/api/queue").then((res) => res.data)
  );

  // TODO: let's just send a timestamp with every server response...
  let serverTime = useQuery("serverTime", () =>
    axios.get("http://localhost:3001/api/currentTime").then((res) => res.data)
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

  if (result.isLoading || serverTime.isLoading) {
    return <div>loading...</div>;
  }

  serverTime = serverTime.data.currentTime;

  // TODO: I don't want to keep calculating this... I should've done this just when I queried the server!
  // what is the exact rule of useEffect...? What is and isn't recalculated.
  const timeDiff = new Date().getTime() - serverTime;
  console.log(`timeDiff is: ${timeDiff}`);

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
          </QueueItem>
        );
      })}
    </QueueContainer>
  );
};

export default App;
