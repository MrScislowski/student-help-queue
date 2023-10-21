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

  // https://stackoverflow.com/questions/72766908/how-to-show-a-countdown-timer-in-react
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000 * 3);
  }, []);

  const queryClient = useQueryClient();
  const getQueuesQuery = useQuery("queues", getActiveQueues);
  const getEntriesQuery = useQuery("entries", getActiveEntries);

  if (getEntriesQuery.isLoading || getQueuesQuery.isLoading) {
    return (
      <>
        <p> queues loading ...</p>
      </>
    );
  }

  return (
    <>
      <p> Queues will go here ...</p>
    </>
  );

  // return (
  //   <>
  //     {accountInfo.activeQueues.map((queueName) => {
  //       return (
  //         <Fragment key={`${queueName}-fragment`}>
  //           <button onClick={() => addNameMutation.mutate(queueName)}>
  //             + {`${queueName} queue`}
  //           </button>
  //           <button onClick={() => archiveQueue(queueName)}> x</button>
  //           <Queue
  //             entries={entries.filter((entry) => entry.queueName === queueName)}
  //             resolveEntryMutation={resolveEntryMutation}
  //             getEntryAge={getEntryAge}
  //           />
  //         </Fragment>
  //       );
  //     })}
  //   </>
  // );
};

export default QueueSet;
