import { Fragment, useContext } from "react";
import Queue from "./Queue";
import { useQuery, useQueryClient } from "react-query";
import { getQueuesForClass } from "../utils/requests";
import SessionContext from "./SessionContext";
import TimeOffsetContext from "./TimeOffsetContext";
import styled from "styled-components";

interface QueueSetProps {
  teacherSlug: string;
  classSlug: string;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  grid-gap: 20px;
`;

const QueueSet = (props: QueueSetProps) => {
  const session = useContext(SessionContext);

  const queryClient = useQueryClient();

  const getEntriesQuery = useQuery({
    queryKey: ["entries"],
    refetchInterval: 3000,
    queryFn: async () =>
      await getQueuesForClass(props.teacherSlug, props.classSlug),
  });

  if (getEntriesQuery.isLoading) {
    return (
      <>
        <p> Loading data ... </p>
      </>
    );
  }

  if (getEntriesQuery.isError) {
    return (
      <>
        <p>Error: {(getEntriesQuery.error as Error).message}</p>
      </>
    );
  }

  let timeOffset = 0;
  if (getEntriesQuery.data) {
    timeOffset =
      new Date().getTime() - new Date(getEntriesQuery.data.timestamp).getTime();
  }

  return (
    <TimeOffsetContext.Provider value={timeOffset}>
      <Container>
        {getEntriesQuery.data?.queues.map((queue) => {
          return (
            <Queue
              key={queue._id}
              teacherSlug={props.teacherSlug}
              classSlug={props.classSlug}
              queue={queue}
            />
          );
        })}
      </Container>
    </TimeOffsetContext.Provider>
  );
};

export default QueueSet;
