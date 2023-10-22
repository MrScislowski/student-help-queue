import { Fragment, useState, useEffect, useContext } from "react";
import Queue from "./Queue";
// import {
//   useAddNameMutation,
//   useGetActiveEntries,
//   useResolveEntryMutation,
// } from "../queries";
import { Session } from "../types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addName, getActiveEntries, getActiveQueues } from "../requests";
import SessionContext from "../SessionContext";

interface QueueSetProps {}

const QueueSet = (props: QueueSetProps) => {
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [theirTime, setTheirTime] = useState(new Date().getTime());
  const [entries, setEntries] = useState([]);
  const [queues, setQueues] = useState([]);
  const session = useContext(SessionContext);

  // https://stackoverflow.com/questions/72766908/how-to-show-a-countdown-timer-in-react
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000 * 3);
  }, []);

  const queryClient = useQueryClient();
  const getQueuesQuery = useQuery({
    queryKey: ["queues"],
    queryFn: getActiveQueues,
    retry: 2,
  });

  const getEntriesQuery = useQuery({
    queryKey: ["entries"],
    queryFn: async () => await getActiveEntries(),
    retry: getQueuesQuery.isError ? false : true,
  });

  const addNameMutation = useMutation({
    mutationFn: ({ queueName }: { queueName: string }) => {
      return addName(queueName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["entries"]);
    },
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

  return (
    <>
      {getQueuesQuery.data.map((queueName) => {
        return (
          <Fragment key={`${queueName}-fragment`}>
            <button onClick={() => addNameMutation.mutate({ queueName })}>
              + {`${queueName} queue`}
            </button>
            <Queue
              entries={
                getEntriesQuery.data?.entries.filter(
                  (entry) => entry.queueName === queueName
                ) || []
              }
              timeDiff={5}
            />
          </Fragment>
        );
      })}
    </>
  );

  // return (
  //   <>
  //     {accountInfo.activeQueues.map((queueName) => {
  //       return (
  // <Fragment key={`${queueName}-fragment`}>
  //   <button onClick={() => addNameMutation.mutate(queueName)}>
  //     + {`${queueName} queue`}
  //   </button>
  //   <button onClick={() => archiveQueue(queueName)}> x</button>
  //   <Queue
  //     entries={entries.filter((entry) => entry.queueName === queueName)}
  //     resolveEntryMutation={resolveEntryMutation}
  //     getEntryAge={getEntryAge}
  //   />
  // </Fragment>
  //       );
  //     })}
  //   </>
  // );
};

export default QueueSet;
