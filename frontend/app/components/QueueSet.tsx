import { Fragment, useContext } from "react";
import Queue from "./Queue";
import { useQuery, useQueryClient } from "react-query";
import { getActiveEntries } from "../requests";
import SessionContext from "../SessionContext";
import TimeOffsetContext from "../TimeOffsetContext";

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

  if (getEntriesQuery.error) {
    return (
      <>
        <p>unable to get queue entries</p>
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
      {getEntriesQuery.data.}
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
