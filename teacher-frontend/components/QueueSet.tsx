import { Fragment, useContext } from "react";
import Queue from "./Queue";
import { useQuery, useQueryClient } from "react-query";
import { getActiveEntries } from "../utils/requests";
import SessionContext from "./SessionContext";
import TimeOffsetContext from "./TimeOffsetContext";

interface QueueSetProps {
  classId: string;
}

const QueueSet = (props: QueueSetProps) => {
  const session = useContext(SessionContext);

  const queryClient = useQueryClient();

  const getEntriesQuery = useQuery({
    queryKey: ["entries"],
    queryFn: async () => await getActiveEntries(props.classId),
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
      {getEntriesQuery.data?.queues.map((queue) => {
        return <Queue key={queue._id} classId={props.classId} queue={queue} />;
      })}
    </TimeOffsetContext.Provider>
  );
};

export default QueueSet;
