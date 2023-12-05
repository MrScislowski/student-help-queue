import styled from "styled-components";
import Queue from "./Queue";
import { useState } from "react";

const Title = styled.h2`
  padding: 10px;
  display: flex;
  align-items: center;
`;

interface QueueTitleProps {
  name: string;
  id: string;
  classId: string;
}

const QueueTitle = (props: QueueTitleProps) => {
  const { name, id, classId } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(name);
  const [originalTitle, setOriginalTitle] = useState(name);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: update queue name in database
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(originalTitle);
  };

  return (
    <Title>
      {isEditing ? (
        <span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </span>
      ) : (
        <span>
          <span>{title}</span>
          <button onClick={handleEdit}>Edit</button>
        </span>
      )}
    </Title>
  );
};

export default QueueTitle;
