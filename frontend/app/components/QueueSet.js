import { React, useState, useEffect } from "react";
import Queue from "./Queue";
import {
  useAddNameMutation,
  useGetActiveEntries,
  useResolveEntryMutation,
} from "../queries";

const QueueSet = (props) => {
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [theirTime, setTheirTime] = useState(new Date().getTime());
  const [entries, setEntries] = useState([]);

  // https://stackoverflow.com/questions/72766908/how-to-show-a-countdown-timer-in-react
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000 * 3);
  }, []);

  // do the fetch here...

  return (
    <>
      <p> Queues will go here ...</p>
    </>
  );

  return (
    <>
      {accountInfo.activeQueues.map((queueName) => {
        return (
          <React.Fragment key={`${queueName}-fragment`}>
            <button onClick={() => addNameMutation.mutate(queueName)}>
              + {`${queueName} queue`}
            </button>
            <button onClick={() => archiveQueue(queueName)}> x</button>
            <Queue
              entries={entries.filter((entry) => entry.queueName === queueName)}
              resolveEntryMutation={resolveEntryMutation}
              getEntryAge={getEntryAge}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default QueueSet;
