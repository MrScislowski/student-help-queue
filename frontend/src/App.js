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
  // TODO: should both of these queries be combined into one?
  const result = useQuery("activeEntries", () =>
    axios.get("http://localhost:3001/api/queue").then((res) => res.data)
  );

  let serverTime = useQuery("serverTime", () =>
    axios.get("http://localhost:3001/api/currentTime").then((res) => res.data)
  );

  if (result.isLoading || serverTime.isLoading) {
    return <div>loading...</div>;
  }

  serverTime = serverTime.data.currentTime;

  const timeDiff = new Date().getTime() - serverTime;

  const getEntryAge = (timestamp) => {
    const millis =
      new Date().getTime() - new Date(timestamp).getTime() - timeDiff;
    const minutes = Math.floor(millis / 1000 / 60);
    if (minutes < 1) {
      return "< 1 m";
    } else {
      return `${minutes} m`;
    }
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
