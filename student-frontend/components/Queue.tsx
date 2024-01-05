import styled from "styled-components";
import { Queue } from "../types/types";
import { useMutation, useQueryClient } from "react-query";
import { addName } from "../utils/requests";
import { useContext, useEffect, useState } from "react";
import TimeOffsetContext from "./TimeOffsetContext";
import SessionContext from "./SessionContext";
import QueueTitle from "./QueueTitle";
import QueueEntry from "./QueueEntry";

const EntriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #8d94ba;
  padding: 10px;
  border-radius: 10px;
`;

const AddNameButton = styled.button`
  border-radius: 10px;
`;

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
      return addName(teacherSlug, classSlug, queueId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["entries"]);
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
        {entries.map((entry) => {
          return (
            <QueueEntry
              key={entry.user.email}
              teacherSlug={teacherSlug}
              classSlug={classSlug}
              queueId={queueId}
              entry={entry}
              currentTime={currentTime}
              timeOffset={timeOffset}
            />
          );
        })}
      </EntriesContainer>
    </>
  );
};

export default Queue;
