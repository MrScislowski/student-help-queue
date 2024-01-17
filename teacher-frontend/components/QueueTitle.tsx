import styled from "styled-components";
import Queue from "./Queue";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  changeQueueVisibility,
  deleteQueue,
  renameQueue,
} from "../utils/requests";
import { Queue as QueueType } from "../types/types";

type TitleProps = {
  visible: boolean;
};

const Title = styled.h2<TitleProps>`
  padding: 10px;
  display: flex;
  align-items: center;
  color: ${(props) => (props.visible ? "black" : "lightgrey")};
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
  teacherSlug: string;
  classSlug: string;
  queue: QueueType;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  addName: () => void;
}

const QueueTitle = (props: QueueTitleProps) => {
  const { teacherSlug, classSlug, queue } = props;
  const name = queue.displayName;
  const id = queue._id;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(name);
  const [originalTitle, setOriginalTitle] = useState(name);
  const { collapsed, setCollapsed } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const renameQueueMutation = useMutation({
    mutationFn: async ({ newName }: { newName: string }) => {
      await renameQueue(teacherSlug, classSlug, id, newName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["entries"]);
    },
  });

  const deleteQueueMutation = useMutation({
    mutationFn: async () => {
      await deleteQueue(teacherSlug, classSlug, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["entries"]);
    },
  });

  const changeVisibilityMutation = useMutation({
    mutationFn: async () => {
      await changeQueueVisibility(teacherSlug, classSlug, id, !queue.visible);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["entries"]);
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSave = () => {
    setIsEditing(false);
    setOriginalTitle(title);
    renameQueueMutation.mutate({ newName: title });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(originalTitle);
  };

  const handleDelete = () => {
    deleteQueueMutation.mutate();
  };

  const handleChangeVisibility = () => {
    // if it's currently visible, collapse it
    if (queue.visible) {
      setCollapsed(true);
    }
    changeVisibilityMutation.mutate();
  };

  return (
    <Title visible={queue.visible}>
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
          <button onClick={handleCancel}>❌</button>
          <button onClick={handleSave}>💾</button>
        </EditContainer>
      ) : (
        <span>
          {title}
          <button onClick={handleEdit}>✏️</button>
          <button onClick={handleChangeVisibility}>
            {queue.visible ? "Hide" : "Show"}
          </button>
          <button onClick={handleDelete}>🗑️</button>
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "↓" : "↑"}
          </button>
        </span>
      )}
    </Title>
  );
};

export default QueueTitle;
