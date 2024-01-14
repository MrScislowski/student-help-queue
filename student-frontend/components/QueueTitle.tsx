import styled from "styled-components";
import { Queue as QueueType } from "../types/types";
import { useContext } from "react";
import SessionContext from "./SessionContext";

const Title = styled.h2`
  padding: 10px;
  display: flex;
  align-items: center;
`;

interface QueueTitleProps {
  teacherSlug: string;
  classSlug: string;
  queue: QueueType;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  addName: () => void;
}

const QueueTitle = (props: QueueTitleProps) => {
  const name = props.queue.displayName;
  const { collapsed, setCollapsed } = props;
  const session = useContext(SessionContext);
  const positionInQueue = props.queue.entries.findIndex(
    (entry) => entry.user.email === session.user.email
  );

  const positionSummary =
    positionInQueue === -1 ? "" : `${positionInQueue + 1}/`;
  const summaryString = `${positionSummary}${props.queue.entries.length}`;

  const isInQueue = positionInQueue !== -1;

  return (
    <Title>
      {name} ({summaryString})
      <button onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "↓" : "↑"}
      </button>
      {!isInQueue ? <button onClick={() => props.addName()}>+</button> : ""}
    </Title>
  );
};

export default QueueTitle;
