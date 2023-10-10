import { activateQueue, deleteQueue } from "../requests";

const ArchivedQueue = (props) => {
  const queueName = props.name;

  return (
    <>
      <span>{queueName}</span>
      <button onClick={() => activateQueue(queueName)}>^</button>
      <button onClick={() => deleteQueue(queueName)}>x</button>
    </>
  );
};

export default ArchivedQueue;
