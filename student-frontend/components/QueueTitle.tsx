import styled from "styled-components";
import { Queue as QueueType } from "../types/types";

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
}

const QueueTitle = (props: QueueTitleProps) => {
  const name = props.queue.displayName;
  const { collapsed, setCollapsed } = props;

  return (
    <Title>
      {name} ( {props.queue.entries.length} )
      <button onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "↓" : "↑"}
      </button>
    </Title>
  );
};

export default QueueTitle;
