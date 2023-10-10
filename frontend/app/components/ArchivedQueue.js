import { activateQueue } from "../requests";

const ArchivedQueue = (props) => {
  const queueName = props.name;

  return (
    <>
      <span>{queueName}</span>
      <button onClick={() => activateQueue(queueName)}>^</button>
    </>
  );
};

export default ArchivedQueue;
