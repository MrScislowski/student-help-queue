import styled from "styled-components";
import Queue from "./Queue";
import { useRef, useState } from "react";

const Title = styled.h2`
  padding: 10px;
  display: flex;
  align-items: center;
`;

const TitleInput = styled.input`
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  border: none;
  outline: none;
  background: none;
  flex-grow: 1;
`;

const EditContainer = styled.div`
  display: flex;
  align-items: left;
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
    setOriginalTitle(title);
    // TODO: update queue name in database
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(originalTitle);
  };

  return (
    <Title>
      {isEditing ? (
        <EditContainer>
          <TitleInput
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
        </EditContainer>
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
