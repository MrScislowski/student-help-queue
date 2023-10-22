import styled from "styled-components";
import { ActiveEntry, ResolutionStatus } from "../types";
import { useMutation, useQueryClient } from "react-query";
import { resolveEntry } from "../requests";
import { useContext, useEffect, useState } from "react";
import TimeOffsetContext from "../TimeOffsetContext";

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

const getEntryAge = (
  currentTime: number,
  entryTime: number,
  timeOffset: number
) => {
  const age = currentTime - (entryTime + timeOffset);
  const minutes = Math.floor(age / 1000 / 60);
  if (minutes < 1) {
    return "< 1m";
  } else if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes - hours * 60}m`;
  }
  return `${minutes}m`;
};

interface QueueProps {
  entries: ActiveEntry[];
}

const Queue = (props: QueueProps) => {
  const { entries } = props;
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const queryClient = useQueryClient();
  const resolveEntryMutation = useMutation({
    mutationFn: ({ entry }: { entry: ActiveEntry }) => {
      return resolveEntry(entry, "resolve");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  const cancelEntryMutation = useMutation({
    mutationFn: ({ entry }: { entry: ActiveEntry }) => {
      return resolveEntry(entry, "cancel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  const timeOffset = useContext(TimeOffsetContext);

  // TODO: should this go in queueSet since it happens in every queue...?
  // https://stackoverflow.com/questions/72766908/how-to-show-a-countdown-timer-in-react
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000 * 3);
  }, []);

  return (
    <Container>
      {entries.map((item) => {
        return (
          <QueueItem key={item.request.user.email}>
            {item.request.user.givenName} {item.request.user.familyName} (
            {getEntryAge(
              currentTime,
              new Date(item.request.timestamp).getTime(),
              timeOffset
            )}
            )
            {item._id && (
              <>
                <ResolveButton
                  onClick={() => {
                    resolveEntryMutation.mutate({
                      entry: item,
                    });
                  }}
                >
                  Resolve
                </ResolveButton>
                <CancelButton
                  onClick={async () => {
                    cancelEntryMutation.mutate({
                      entry: item,
                    });
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
