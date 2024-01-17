import styled from "styled-components";
import { Queue } from "../types/types";
import { useMutation, useQueryClient } from "react-query";
import { addName } from "../utils/requests";
import { useContext, useEffect, useState } from "react";
import TimeOffsetContext from "./TimeOffsetContext";
import SessionContext from "./SessionContext";
import QueueTitle from "./QueueTitle";
import QueueEntry from "./QueueEntry";

const Container = styled.div`
  min-width: 400px;
`;

const EntriesContainer = styled.div`
  background-color: #8d94ba;
  padding: 10px;
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
  const [collapsed, setCollapsed] = useState(false);
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
      <Container>
        <QueueTitle
          teacherSlug={teacherSlug}
          classSlug={classSlug}
          queue={queue}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          addName={() => addNameMutation.mutate()}
        />
        {collapsed ? (
          ""
        ) : (
          <>
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
        )}
      </Container>
    </>
  );
};

export default Queue;
