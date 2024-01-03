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
}

const QueueTitle = (props: QueueTitleProps) => {
  const name = props.queue.displayName;

  return <Title>{name}</Title>;
};

export default QueueTitle;
