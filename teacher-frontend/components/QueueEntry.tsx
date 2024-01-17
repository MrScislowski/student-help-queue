import styled from "styled-components";

import { ActiveEntry } from "../types/types";
import { useMutation, useQueryClient } from "react-query";
import { resolveEntry } from "../utils/requests";
import { useContext } from "react";
import SessionContext from "./SessionContext";

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

interface QueueEntryProps {
  teacherSlug: string;
  classSlug: string;
  queueId: string;
  entry: ActiveEntry;
  currentTime: number;
  timeOffset: number;
}

const QueueEntry = (props: QueueEntryProps) => {
  const queryClient = useQueryClient();
  const { teacherSlug, classSlug, queueId, entry, currentTime, timeOffset } =
    props;
  const session = useContext(SessionContext);

  const resolveEntryMutation = useMutation({
    mutationFn: ({ studentEmail }: { studentEmail: string }) => {
      return resolveEntry(
        teacherSlug,
        classSlug,
        queueId,
        studentEmail,
        "resolve"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  const cancelEntryMutation = useMutation({
    mutationFn: ({ studentEmail }: { studentEmail: string }) => {
      return resolveEntry(
        teacherSlug,
        classSlug,
        queueId,
        studentEmail,
        "cancel"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  return (
    <QueueItem key={entry.user.email}>
      {entry.user.givenName} {entry.user.familyName} (
      {getEntryAge(
        currentTime,
        new Date(entry.timeAdded).getTime(),
        timeOffset
      )}
      )
      {entry.user.email === session.user.email ? (
        <>
          <ResolveButton
            onClick={() => {
              resolveEntryMutation.mutate({
                studentEmail: entry.user.email,
              });
            }}
          >
            Resolve
          </ResolveButton>
          <CancelButton
            onClick={async () => {
              cancelEntryMutation.mutate({
                studentEmail: entry.user.email,
              });
            }}
          >
            Cancel
          </CancelButton>
        </>
      ) : (
        <></>
      )}
    </QueueItem>
  );
};

export default QueueEntry;
