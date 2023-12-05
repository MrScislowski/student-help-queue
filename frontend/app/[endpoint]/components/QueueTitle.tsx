import styled from "styled-components";
import Queue from "./Queue";
import { useRef, useState } from "react";

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

  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
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
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave();
              }
            }}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </span>
      ) : (
        <span>
          {title}
          <button onClick={handleEdit}>Edit</button>
        </span>
      )}
    </Title>
  );
};

export default QueueTitle;
