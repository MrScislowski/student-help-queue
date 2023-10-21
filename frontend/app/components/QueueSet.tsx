import { Fragment, useState, useEffect } from "react";
import Queue from "./Queue";
// import {
//   useAddNameMutation,
//   useGetActiveEntries,
//   useResolveEntryMutation,
// } from "../queries";
import { Session } from "../types";
import { useQuery, useQueryClient } from "react-query";
import { getActiveEntries, getActiveQueues } from "../requests";

interface QueueSetProps {
  session: Session;
}

const QueueSet = (props: QueueSetProps) => {
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [theirTime, setTheirTime] = useState(new Date().getTime());
  const [entries, setEntries] = useState([]);
  const [queues, setQueues] = useState([]);

  // https://stackoverflow.com/questions/72766908/how-to-show-a-countdown-timer-in-react
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000 * 3);
  }, []);

  const queryClient = useQueryClient();
  const getQueuesQuery = useQuery({
    queryKey: "queues",
    queryFn: getActiveQueues,
    retry: 2,
  });

  const getEntriesQuery = useQuery({
    queryKey: "entries",
    queryFn: getActiveEntries,
    retry: getQueuesQuery.isError ? false : true,
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
          {`"${props.session.selectedClass.name}"`}
          with teacher email {props.session.selectedClass.teacherEmail}
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

  console.log(JSON.stringify(getQueuesQuery.data));
  return (
    <>
      {getQueuesQuery.data.map((queueName) => {
        return (
          <Fragment key={`${queueName}-fragment`}>
            <button onClick={() => alert("not implemented yet")}>
              + {`${queueName} queue`}
            </button>
            <Queue
              entries={
                getEntriesQuery.data?.entries.filter(
                  (entry) => entry.queueName === queueName
                ) || []
              }
              resolveEntryMutation={() =>
                alert("resolve entry mutation not yet defined")
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
