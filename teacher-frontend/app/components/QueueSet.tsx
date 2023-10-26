import { Fragment, useContext } from "react";
import Queue from "./Queue";
import { useQuery, useQueryClient } from "react-query";
import { getActiveEntries, getActiveQueues } from "../requests";
import SessionContext from "../SessionContext";
import TimeOffsetContext from "../TimeOffsetContext";

const refetchInterval = 3000; // 3 seconds

interface QueueSetProps {}

const QueueSet = (props: QueueSetProps) => {
  const session = useContext(SessionContext);

  const queryClient = useQueryClient();
  const getQueuesQuery = useQuery({
    queryKey: ["queues"],
    queryFn: getActiveQueues,
    retry: 2,
    refetchInterval: refetchInterval, 
  });

  const getEntriesQuery = useQuery({
    queryKey: ["entries"],
    queryFn: async () => await getActiveEntries(),
    retry: getQueuesQuery.isError ? false : true,
    refetchInterval: refetchInterval, 
  });

  if (getEntriesQuery.isLoading || getQueuesQuery.isLoading) {
    return (
      <>
        <p> Loading data ... </p>
      </>
    );
  }

  if (getQueuesQuery.error || !getQueuesQuery.data) {
    return (
      <>
        <p>
          unable to get queues for class
          {`"${session.selectedClass.name}"`}
          with teacher email {session.selectedClass.teacherEmail}
        </p>
      </>
    );
  }

  if (getEntriesQuery.error) {
    return (
      <>
        <p>unable to get entries in queues: {`${getQueuesQuery.data}`}</p>
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
      {getQueuesQuery.data.map((queueName) => {
        return (
          <Queue
            key={queueName}
            queueName={queueName}
            entries={
              getEntriesQuery.data?.entries.filter(
                (entry) => entry.queueName === queueName
              ) || []
            }
          />
        );
      })}
    </TimeOffsetContext.Provider>
  );
};

export default QueueSet;
