import styled from "styled-components";
import { ActiveEntry, ResolutionStatus } from "../types";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #8d94ba;
  padding: 10px;
  border-radius: 10px;
`;

const QueueItem = styled.div`
  background-color: #a0cfd3;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
`;

const ResolveButton = styled.button`
  background-color: rgb(233, 246, 233);
  border: none;
  border-radius: 5px;
`;

const CancelButton = styled.button`
  background-color: rgb(255, 241, 223);
  border: none;
  border-radius: 5px;
`;

// const getEntryAge = (timestamp: string) => {
//   const millis = currentTime - new Date(timestamp).getTime() - timeDiff;
//   const minutes = Math.floor(millis / 1000 / 60);
//   if (minutes < 1) {
//     return "< 1m";
//   } else if (minutes > 60) {
//     const hours = Math.floor(minutes / 60);
//     return `${hours}h ${minutes - hours * 60}m`;
//   }
//   return `${minutes}m`;
// };

const getEntryAge = (timestamp: string) => {
  return "1m";
};

interface QueueProps {
  entries: ActiveEntry[];
  resolveEntryMutation: ({
    entry,
    status,
  }: {
    entry: ActiveEntry;
    status: ResolutionStatus;
  }) => void;
  timeDiff: Number;
}

const Queue = (props: QueueProps) => {
  const { entries, resolveEntryMutation, timeDiff } = props;

  return (
    <Container>
      {entries.map((item) => {
        return (
          <QueueItem key={item.request.user.email}>
            {item.request.user.givenName} {item.request.user.familyName} (
            {getEntryAge(item.request.timestamp)})
            {item._id && (
              <>
                <ResolveButton
                  onClick={async () => {
                    // await resolveEntryMutation.mutate({
                    //   entry: item,
                    //   resolutionStatus: "resolve",
                    // });
                    alert("resolve entry mutation not yet defined");
                  }}
                >
                  Resolve
                </ResolveButton>
                <CancelButton
                  onClick={async () => {
                    // await resolveEntryMutation.mutate({
                    //   entry: item,
                    //   resolutionStatus: "cancel",
                    // });
                    alert("resolve entry mutation not yet defined");
                  }}
                >
                  Cancel
                </CancelButton>
              </>
            )}
          </QueueItem>
        );
      })}
    </Container>
  );
};

export default Queue;
