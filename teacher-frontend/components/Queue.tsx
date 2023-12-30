import styled from "styled-components";
import { ActiveEntry, Queue, ResolutionStatus } from "../types/types";
import { useMutation, useQueryClient } from "react-query";
import { resolveEntry, addName } from "../utils/requests";
import { useContext, useEffect, useState } from "react";
import TimeOffsetContext from "./TimeOffsetContext";
import SessionContext from "./SessionContext";
import QueueTitle from "./QueueTitle";

const EntriesContainer = styled.div`
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

const AddNameButton = styled.button`
  border-radius: 10px;
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
  teacherSlug: string;
  classSlug: string;
  queue: Queue;
}

const Queue = (props: QueueProps) => {
  const { teacherSlug, classSlug, queue } = props;
  const queueName = queue.displayName;
  const queueId = queue._id;
  const entries = queue.entries;

  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const session = useContext(SessionContext);

  const queryClient = useQueryClient();

  const addNameMutation = useMutation({
    mutationFn: () => {
      return addName(classSlug, queueId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["entries"]);
    },
  });

  const resolveEntryMutation = useMutation({
    mutationFn: ({ studentEmail }: { studentEmail: string }) => {
      return resolveEntry(classSlug, queueId, studentEmail, "resolve");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  const cancelEntryMutation = useMutation({
    mutationFn: ({ studentEmail }: { studentEmail: string }) => {
      return resolveEntry(classSlug, queueId, studentEmail, "cancel");
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
    <>
      <QueueTitle
        teacherSlug={teacherSlug}
        classSlug={classSlug}
        queue={queue}
      />

      {entries.find((entry) => entry.user.email === session.user.email) ? (
        ""
      ) : (
        <button onClick={() => addNameMutation.mutate()}>add name</button>
      )}

      <EntriesContainer>
        {entries.map((item) => {
          return (
            <QueueItem key={item.user.email}>
              {item.user.givenName} {item.user.familyName} (
              {getEntryAge(
                currentTime,
                new Date(item.timestamp).getTime(),
                timeOffset
              )}
              ) (
              <>
                <ResolveButton
                  onClick={() => {
                    resolveEntryMutation.mutate({
                      studentEmail: item.user.email,
                    });
                  }}
                >
                  Resolve
                </ResolveButton>
                <CancelButton
                  onClick={async () => {
                    cancelEntryMutation.mutate({
                      studentEmail: item.user.email,
                    });
                  }}
                >
                  Cancel
                </CancelButton>
              </>
              )
            </QueueItem>
          );
        })}
      </EntriesContainer>
    </>
  );
};

export default Queue;
