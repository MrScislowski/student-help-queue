// import { getAccountInfo } from "../requests";
// import ArchivedQueue from "./ArchivedQueue";

// const QueueAdmin = (props) => {
//   const [proposedNewQueueName, setProposedNewQueueName] = useState("");
//   const [accountInfo, setAccountInfo] = useState({
//     activeQueues: [],
//     archivedQueues: [],
//   });

//   useEffect(() => {
//     const doTheFetch = async () => {
//       const retrievedInfo = await getAccountInfo();
//       setAccountInfo(retrievedInfo);
//     };
//     doTheFetch();
//   }, []);

//   const attemptNewQueueCreation = (queueName) => {
//     if (
//       accountInfo.activeQueues.includes(queueName) ||
//       accountInfo.archivedQueues.includes(queueName)
//     ) {
//       alert("There's already a queue with that name");
//       return;
//     }

//     addQueue(queueName).then(() => {
//       setProposedNewQueueName("");
//       // TODO: use queryClient instead of useEffect, then invalidate queries here...
//     });
//   };

//   return (
//     <>
//       <input
//         type="text"
//         value={proposedNewQueueName}
//         onChange={(e) => setProposedNewQueueName(e.target.value)}
//       ></input>
//       <button onClick={() => attemptNewQueueCreation(proposedNewQueueName)}>
//         Add new queue
//       </button>
//       <br></br>

//       <br></br>
//       <div>
//         <p>Archived queues: </p>
//         <ul>
//           {accountInfo.archivedQueues.map((queueName) => {
//             return (
//               <li key={queueName}>
//                 <ArchivedQueue key={queueName} name={queueName} />
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default QueueAdmin;
