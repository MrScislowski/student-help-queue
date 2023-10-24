import { activateQueue, deleteQueue } from "../requests";

interface ArchivedQueueProps {
  queueName: string;
}

const ArchivedQueue = (props: ArchivedQueueProps) => {
  const queueName = props.queueName;

  return (
    <>
      <span>{queueName}</span>
      <button onClick={() => activateQueue(queueName)}>^</button>
      <button onClick={() => deleteQueue(queueName)}>x</button>
    </>
  );
};

export default ArchivedQueue;
