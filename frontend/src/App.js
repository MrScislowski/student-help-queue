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

  if (result.isLoading) {
    return <div>loading...</div>;
  }

  return (
    <QueueContainer>
      {result.data.map((item) => {
        return (
          <QueueItem key={item.requestor.id}>
            {item.requestor.displayName}
          </QueueItem>
        );
      })}
    </QueueContainer>
  );
};

export default App;
